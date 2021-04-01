#!/usr/bin/env python
# coding: utf-8

# In[6]:


import pandas as pd
import io
import requests
import numpy as np
from datetime import date


# In[7]:


def web_csv_to_json(url, filter_function):
    csv = requests.get(url).content
    data = pd.read_csv(io.StringIO(csv.decode('utf-8')))
    filtered_data = filter_function(data)
    return filtered_data.replace({np.nan: None})


# In[8]:


VACCINATIONS_URL = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.csv'
JHU_FULL_DATA_URL = 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/jhu/full_data.csv'


# In[9]:


vaccinations = web_csv_to_json(VACCINATIONS_URL, lambda vaccinations_df: vaccinations_df[vaccinations_df.iso_code == 'BRA'])
vaccinations.to_json('./vaccinations_{}.json'.format(date.today()))


# In[10]:


jhu_full_data = web_csv_to_json(JHU_FULL_DATA_URL, lambda df: df[df.location == 'Brazil'])
jhu_full_data.to_json('./jhu_full_data_{}.json'.format(date.today()))

