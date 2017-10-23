## Post Visualization Creation

### Step 1 

Add component prefixed with diwo-visual on folder and DiwoVisual on component name in shared/shareables/visuals/.

### Step 2

When component is created extend class BaseVisual from shared/shareables/visuals/base-visual.ts

### Step 3 

Import and add the newly created class to the array VisualList in shared/shareables/shareables.module.ts

### Step 4

INFO: The visual components are dynamically created/rendered by the directive dynamic-component in shared/snippets/dynamic-component.

    The main input [dynamic-component] takes the class name string of a visual and compares the string to a dynamically created object from the VisualList array (refer to step 3).

    The data input [data] takes in the data to pass to the visual. For this to work, the visual MUST extend BaseVisual class.