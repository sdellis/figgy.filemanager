# Filemanager jQuery UI plugin

## Description
This plugin provides an easy-to-use user interface for managing and automating
metadata for images that represent pages. This assumes you are using jQuery,
jQueryUI, and Bootstrap CSS.

(Future plans are not to assume Bootstrap, but to theme like any other jQueryUI widget.)

## Usage
This plugin is tested and ready to be dropped into your web page.

Here's what you need to do:

### 1. Include the source files

Add the CSS in the `<head>` of your webpage:
```
  <link href="http://sdellis.com/figgy.filemanager/css/jquery.figgy.filemanager.css" rel="stylesheet">
```

Add the JS in the `</body>` of your webpage:
```
  <link href="http://sdellis.com/figgy.filemanager/js/jquery.figgy.filemanager.js" rel="stylesheet">
```

### 2. Feed it some data:
The Filemanager plugin needs some image data to work with. You can simply pass
it some JSON that's formatted like so (an array of objects):

```
var img_collection = [
  {
    "id": "s1544br12w",
    "url": "https://libimages1.princeton.edu/loris/plum/s1%2F54%2F4b%2Fr1%2F2w-intermediate_file.jp2/full/!600,600/0/default.jpg",
    "label": "1",
    "pageType": "single",
    "isThumb": null,
    "isStart": null,
    "selected": false
  }, ...
]
```

### 3. Drop it in:
Now, all that's necessary to run the plugin is the following:

Add a div with the id of your choice:
`<div id="filemanager"></div>`

Instantiate it using the selector for that div:
`$("#filemanager").filemanager({ images: img_collection })`

### 4. Capture the edited data:
In addition to instantiating the plugin, you will want to listen for the
`objectSaved` event, which passes the newly updated data back so you can
do something with it.

Here's an example of the event logging the new data to the console:

```
<script>
    $(function() {

      $("#filemanager").filemanager({ images: img_collection })

      // listen for the objectSaved event to catch and persist the data
      $( "body" ).on( "objectSaved", function( event, new_img_collection ) {
          console.log(new_img_collection)
      });

    });
  </script>
```

## Run the tests
``` bash
# install dependencies
npm install

# run all tests
npm test
```
