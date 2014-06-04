init($view)
-----------
**Parameters**

**$view**:  *$*,  The "container" element that should be managed

decorate()
----------
Constructs an instance of the controller with the passed args


**Returns**

*BeFF/Controller*,  An instance of the controller

add(resultset)
--------------
Constructs a controller for every element of the resultset
and renders the controller into the managed $view


**Parameters**

**resultset**:  *Array*,  A list of JSON objects representing new items in the container

**Returns**

*Array*,  A list of the newly constructed controllers rendered into $view

empty()
-------
Destroys all of the managed controllers and empties
the managed $view


**Returns**

*$*,  The newly emptied $view

isEmpty()
---------
**Returns**

*Boolean*,  Whether or not there are any managed controllers

