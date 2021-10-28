from bs4 import BeautifulSoup

# Html
html_source = '''
       <a href="https://ex.com/home">Converting File Size in Python</a> 
'''

# BeautifulSoup
soup = BeautifulSoup(html_source, 'html.parser')

# Find element which have href attr
el = soup.find(href=True)

# Print href value
print(el['href'])