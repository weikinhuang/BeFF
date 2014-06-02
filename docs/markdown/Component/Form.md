decompose(inputs)
-----------------
Takes a serialized Array (such as from $.serializeArray) and
transforms it into a JSON structure apporpriate for sending
as data over and ajax request.




**Parameters**

**inputs**:  *Array*,  - List objects with the form { name: 'foo', value: 'bar' }

**Returns**

*Object*,  obj - Map of input names to input values

commit()
--------
Inner Submission process. Should be limited to the forms specific behaviors that are
dependent on pre- and post- submission of the form. For the majority of simple forms,
this should be all that needs to be overridden.

Default implementation simply submits the form data to the form's defined endpoint.


validator()
-----------
Default validator does nothing


