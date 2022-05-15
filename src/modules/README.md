Modules are vue component(s) pared with one or multiple service files 
that provide extendable functionality. 

The aim for modules is to create reusable set of files can be shared
in differnt projects.

Different from a normal component which is specifically binded with
the current project. A module should consistently expanding and 
improving along with the project development.

In a module folder, everything should enclosed and working within it
the only way to pass in data and send out data is through props and
emits.

Each Module should be documented properly:
/**
 * @author 
 * @lastUpdate 
 *
 * Some description
 *
 * @depencencies []
 *
 * @props property: description
 *
 * @emits events: description
 */