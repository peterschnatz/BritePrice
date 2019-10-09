"""
This program will take a date from the user and use the Google REST API
Custom Search Engine to search for Eventbrite events that occurred on
each of those dates. It will scrape the event ids from the search results
urls and save them to a file.

Once the Google API daily limit has been reached (1000 queries), the program
will use the logged event ids and the Eventbrite API to gather the information
and details on each event, organize them into a pandas dataframe and save to
a *.csv file.

2019-10-05: Peter Schnatz. Created.
"""

import pandas as pd
import requests
import os
import datetime
import timeit


# Get start date for grabing event information
year = input('Enter the start year: ')
month = input('Enter the start month: ')
day = input('Enter the start day: ')


def get_keys_from_file(filename):
    """
    This function gets credentials for API
    from file in directory.
    """
    import imp
    f = open(filename)
    global keys
    keys = imp.load_source('keys',filename)
    f.close()



# Grab Google API credentials
get_keys_from_file('/Users/peterschnatz/Insight/Project1/RightPrice/google_keys.py')

google_api_token = keys.API_key
google_cx = keys.cx
google_api_base = keys.base



import time
import datetime as dt


def daterange_rev(start_date, end_date):
    """
    Each time this function is called, it will output a date
    starting with start_date and going backward in time one
    day at a time until it reaches end_date
    """
    for n in range(abs(int((end_date - start_date).days))):
        yield start_date - dt.timedelta(n)



# Check if file is empty and append event ids if not.
if os.stat('past_event_ids.txt').st_size == 0:
    mode = 'w'
else:
    mode = 'a'


# Open file to write event ids  
with open('past_event_ids.txt', mode) as filehandle:

    """
    Initialize base, start/end dates, event_ids, and error
    """
    event_id_base = '/e/'

    start_date = dt.date(int(year), int(month), int(day))
    end_date = dt.date(2010, 1, 1)

    event_ids = []
    error = 0

    line_count = 0


    # Loop through dates in reverse from start_date
    for single_date in daterange_rev(start_date, end_date):
        startIndex = 1 # Initialize start index

        """
        Custom Search Engine only allows 100 search results.
        Loop through all 100.
        """
        while startIndex <= 100:
            time.sleep(1) # Do not exceed rate limit
            
            # Google query - make sure ticketfly is not mentioned; artifact of merger.
            request = requests.get(google_api_base+'key='+google_api_token+'&cx='+google_cx+'&start='+str(startIndex)+'&q='+str(single_date.strftime("%B"))+' '+str(single_date.day)+' '+str(single_date.year) + ' -ticketfly')
     
            # Check for successful request
            if request.status_code != 200:
                end_point = {'single_date' : single_date, 
                             'startIndex' : startIndex, 
                             'page' : page}
                error = 1
                print('Request error code %d' % request.status_code)
                print('Reason: %s' % request.json()['error']['errors'][0]['reason'])
                print('Message: %s' % request.json()['error']['message'])
                break
                
            # Transform request into JSON
            request_json = request.json()

            # Grab event IDs from each URL in search results
            for page in request_json['items']:
                try:
                    # check og_type
                    event_ogtype = page['pagemap']['metatags'][0]['og:type']

                    # end index of event id in url string
                    event_id_end = page['pagemap']['metatags'][0]['og:url'].find('?aff')
                    
                except KeyError:
                    print('KeyError: No metatags')
                    
                else:
                    if event_ogtype == 'events.event':
                        try:
                            
                            # start index of event id in url string
                            event_id_start = page['pagemap']['metatags'][0]['og:url'].find(event_id_base) + len(event_id_base)
                            
                            # write event_id to file
                            filehandle.write('%s\n' % int(page['pagemap']['metatags'][0]['og:url'][event_id_start:event_id_end]))
                            line_count += 1

                            # add event id to list
                            event_ids.append(int(page['pagemap']['metatags'][0]['og:url'][event_id_start:event_id_end]))
                      
                        except:
                            print('Error: base probably not found')
                            continue

            # Update start index
            startIndex = request_json['queries']['nextPage'][0]['startIndex']
        
        # No errors
        if error == 1: break
        
        # Alert user that date is finished
        print(single_date)

    # When daily API limit is reached, write the last date used to a file.
    with open('nextdate.txt', 'w') as filehandle:
        filehandle.write('%s' % single_date)

    print('File name: %s\nNew lines %d' % (filehandle.name, line_count))





# Grab Eventbrite API credentials
get_keys_from_file('/Users/peterschnatz/Insight/Project1/RightPrice/eventbrite_keys.py')

eventbrite_api_token = keys.PRIVATE_TOKEN

eventbrite_api_base = keys.base



    


# define empty list
past_event_ids = []


def add_id(line):
    # remove linebreak which is the last character of the string
    current_id = line[:-1]

    # add item to the list
    past_event_ids.append(current_id)


# last event id of former past_event_ids
first_event = str(event_ids[0])+'\n'

"""
Open file containing past_event_ids and read ids starting
at the first event from the ids captured above in Google
API queries.
"""
with open('past_event_ids.txt', 'r') as filehandle:
    filecontents = filehandle.readlines()
    start = 0
    for line in filecontents:
        if start == 0:
            add_id(line)

        elif line == first_event:
            add_id(line)
            start = 1
            continue

    print('%d event ids read to list.' % (len(past_event_ids)))


# Eliminate duplicates
past_event_ids = list(dict.fromkeys(past_event_ids))


# Initialize status variables and event dataframe
error = 0
count = 0
event_df = pd.DataFrame()

"""
Loop through past event ids and capture event and ticket details
"""
for event_id in past_event_ids:
    timeit.time.sleep(0.75) # Do not exceed Eventbrite API rate limit (2000 per hour)


    try:
        request = requests.get(eventbrite_api_base+'events/'+event_id+'/?expand=venue,refund_policy,ticket_classes,listing_properties,ticket_availability&token='+eventbrite_api_token)
   
    except ConnectionError:
        print('ConnectionError for event id %s.' % event_id)
        continue

    # Transform request into JSON
    event_json = request.json()


    count += 1

    if count%100 == 0:
        print('Count: %d' % count)


    # Check that request was successful
    if request.status_code != 200:
        end_point = {'event_id' : event_id} 
        error += 1
        print('Request error code %d' % request.status_code)
        print('Error description: %s' % event_json['error_description'])
        print('Error: %s' % event_json['error'])
        print('\nEvent id raising error: %s' % event_id)
        
        if error > 100:
            break
            
        continue

    try:
        # Read event properties
        event_properties = [{'id' : event_json['id'],
                             'start_tz' : event_json['start']['timezone'],
                             'start_local_dt' : event_json['start']['local'],
                             'start_utc_dt' : event_json['start']['utc'],
                             'end_local_dt' : event_json['end']['local'],
                             'end_utc_dt' : event_json['end']['utc'],
                             'created_dt' : event_json['created'],
                             'published_dt' : event_json['published'],
                             'currency' : event_json['currency'],
                             'listed' : event_json['listed'],
                             'shareable' : event_json['shareable'],
                             'online_event' : event_json['online_event'],
                             'locale' : event_json['locale'],
                             'is_series' : event_json['is_series'],
                             'is_series_parent' : event_json['is_series_parent'],
                             'inventory_type' : event_json['inventory_type'],
                             'is_reserved_seating' : event_json['is_reserved_seating'],
                             'venue_id' : event_json['venue_id'],
                             'category_id' : event_json['category_id'],
                             'subcategory_id' : event_json['subcategory_id'],
                             'format_id' : event_json['format_id'],
                             'city' : event_json['venue']['address']['city'],
                             'region' : event_json['venue']['address']['region'],
                             'postal_code' : event_json['venue']['address']['postal_code'],
                             'country' : event_json['venue']['address']['country'],
                             'refund_policy' : event_json['refund_policy']['refund_policy'],
                             'refund_retention_policy' : event_json['refund_policy']['refund_retention_policy'],
                             'is_paid' : event_json['listing_properties']['is_paid'],
                             'has_available_tickets' : event_json['ticket_availability']['has_available_tickets'],
                             'is_sold_out' : event_json['ticket_availability']['is_sold_out'],
                             'waitlist_available' : event_json['ticket_availability']['waitlist_available']}]

    except:
        """
        Events that occur online will not have location data and will raise an error.
        In this case read in data without location data.
        """
        try:
            
            event_properties = [{'id' : event_json['id'],
                             'start_tz' : event_json['start']['timezone'],
                             'start_local_dt' : event_json['start']['local'],
                             'start_utc_dt' : event_json['start']['utc'],
                             'end_local_dt' : event_json['end']['local'],
                             'end_utc_dt' : event_json['end']['utc'],
                             'created_dt' : event_json['created'],
                             'published_dt' : event_json['published'],
                             'currency' : event_json['currency'],
                             'listed' : event_json['listed'],
                             'shareable' : event_json['shareable'],
                             'online_event' : event_json['online_event'],
                             'locale' : event_json['locale'],
                             'is_series' : event_json['is_series'],
                             'is_series_parent' : event_json['is_series_parent'],
                             'inventory_type' : event_json['inventory_type'],
                             'is_reserved_seating' : event_json['is_reserved_seating'],
                             'venue_id' : event_json['venue_id'],
                             'category_id' : event_json['category_id'],
                             'subcategory_id' : event_json['subcategory_id'],
                             'format_id' : event_json['format_id'],
                             'refund_policy' : event_json['refund_policy']['refund_policy'],
                             'refund_retention_policy' : event_json['refund_policy']['refund_retention_policy'],
                             'is_paid' : event_json['listing_properties']['is_paid'],
                             'has_available_tickets' : event_json['ticket_availability']['has_available_tickets'],
                             'is_sold_out' : event_json['ticket_availability']['is_sold_out'],
                             'waitlist_available' : event_json['ticket_availability']['waitlist_available']}]

        except:
            print('Error while getting event properties. Event_id: %s' % event_id)
            continue

    """
    Grab details on tickets.
    """
    try:
        all_ticket_properties = []
        
        """
        Events can have several ticket classes. Loop through all
        of the classes and gather ticket information
        """
        for tier_num, tier in enumerate(event_json['ticket_classes']):
            try:
                ticket_properties = [{'cost_' + str(tier_num) : tier['cost']['major_value'],
                                      'fee_' + str(tier_num) : tier['fee']['major_value'],
                                      'tax_' + str(tier_num) : tier['tax']['major_value'],
                                      'donation_' + str(tier_num) : tier['donation'],
                                      'free_' + str(tier_num) : tier['free'],
                                      'maximum_quantity_' + str(tier_num) : tier['maximum_quantity'],
                                      'on_sale_status_' + str(tier_num) : tier['on_sale_status'],
                                      'include_fee_' + str(tier_num) : tier['include_fee']}]
            except:
                """
                If tickets are free, the  cost, fee, and tax will be set to None, which raises
                errors. Set them to zero.
                """
                try:
                    ticket_properties = [{'cost_' + str(tier_num) : 0,
                                          'fee_' + str(tier_num) : 0,
                                          'tax_' + str(tier_num) : 0,
                                          'donation_' + str(tier_num) : tier['donation'],
                                          'free_' + str(tier_num) : tier['free'],
                                          'maximum_quantity_' + str(tier_num) : tier['maximum_quantity'],
                                          'on_sale_status_' + str(tier_num) : tier['on_sale_status'],
                                          'include_fee_' + str(tier_num) : tier['include_fee']}]
                except:
                    print('Error in getting ticket properties. Event_id: %s' % event_id)
                    continue
    
            # Combine properties of all ticket classes
            all_ticket_properties = all_ticket_properties + ticket_properties

        # Combine event and ticket properties
        all_properties = event_properties + all_ticket_properties
 
        # Create single dictionary for event
        event_dict = {key: value for d in all_properties for key, value in d.items()}
 
        # Add event to the event dataframe
        event_df = event_df.append(event_dict,ignore_index=True)
     
    except:
        print('Fatal TypeError3 for all properties. Event_id: %s' % event_id)
        continue

# Get today's date and format it
today = dt.date.today()

if today.month < 10:
    todayMonth = str(0)+str(today.month)
else:
    todayMonth = str(today.month)
    
if today.day < 10:
    todayDay = str(0)+str(today.day)
else:
    todayDay = str(today.day)
    

# Save to *.csv labeled with date.
event_df.to_csv('./event_df_large_'+str(today.year)+todayMonth+todayDay+'.csv',index=True)