// @ts-check

// Script run within the webview itself.
(function () {
    console.log('here');
    // var JSONEditor = require('@json-editor/json-editor');
    
    console.log(JSONEditor);
	// Get a reference to the VS Code webview api.
	// We use this API to post messages back to our extension.

	// @ts-ignore
	const vscode = acquireVsCodeApi();


    
const element = document.getElementById('editor');
document.getElementById("editor").innerHTML = "Hello JavaScript!";
console.log(element);
    let editor;/** @type {JSONEditor} */
//         new JSONEditor(element, {
// 	schema: {
// 	  type: "object",
// 	  title: "Car",
// 	  properties: {
// 		make: {
// 		  type: "string",
// 		  enum: [
// 			"Toyota",
// 			"BMW",
// 			"Honda",
// 			"Ford",
// 			"Chevy",
// 			"VW"
// 		  ]
// 		},
// 		model: {
// 		  type: "string"
// 		},
// 		year: {
// 		  type: "integer",
// 		  enum: [
// 			1995,1996,1997,1998,1999,
// 			2000,2001,2002,2003,2004,
// 			2005,2006,2007,2008,2009,
// 			2010,2011,2012,2013,2014
// 		  ],
// 		  default: 2008
// 		},
// 		safety: {
// 		  type: "integer",
// 		  format: "rating",
// 		  maximum: "5",
// 		  exclusiveMaximum: false,
// 		  readonly: false
// 		}
// 	  }
// 	}
//   });
console.log(editor);

	const notesContainer = /** @type {HTMLElement} */ (document.querySelector('.notes'));

	const addButtonContainer = document.querySelector('.add-button');
	addButtonContainer.querySelector('button').addEventListener('click', () => {
		vscode.postMessage({
			type: 'add'
		});
	})

	const errorContainer = document.createElement('div');
	document.body.appendChild(errorContainer);
	errorContainer.className = 'error'
	errorContainer.style.display = 'none'

	/**
	 * Render the document in the webview.
	 */
	function updateContent(/** @type {string} */ text) {
		let json;
		try {
			if (!text) {
				text = '{}';
			}
			json = JSON.parse(text);
		} catch {
			// notesContainer.style.display = 'none';
			// errorContainer.innerText = 'Error: Document is not valid json';
			// errorContainer.style.display = '';
			return;
        }
        editor =/** @type {JSONEditor} */ new JSONEditor(element,{
            schema: json,
            theme: 'bootstrap4'
          });
		// notesContainer.style.display = '';
		// errorContainer.style.display = 'none';

		// // Render the scratches
		// notesContainer.innerHTML = '';
		// for (const note of json.scratches || []) {
		// 	const element = document.createElement('div');
		// 	element.className = 'note';
		// 	notesContainer.appendChild(element);

		// 	const text = document.createElement('div');
		// 	text.className = 'text';
		// 	const textContent = document.createElement('span');
		// 	textContent.innerText = note.text;
		// 	text.appendChild(textContent);
		// 	element.appendChild(text);

		// 	const created = document.createElement('div');
		// 	created.className = 'created';
		// 	created.innerText = new Date(note.created).toUTCString();
		// 	element.appendChild(created);

		// 	const deleteButton = document.createElement('button');
		// 	deleteButton.className = 'delete-button';
		// 	deleteButton.addEventListener('click', () => {
		// 		vscode.postMessage({ type: 'delete', id: note.id, });
		// 	});
		// 	element.appendChild(deleteButton);
		// }

		// notesContainer.appendChild(addButtonContainer);
	}

	// Handle messages sent from the extension to the webview
	window.addEventListener('message', event => {
		const message = event.data; // The json data that the extension sent
		switch (message.type) {
			case 'update':
				const text = message.text;

				// Update our webview's content
				updateContent(text);

				// Then persist state information.
				// This state is returned in the call to `vscode.getState` below when a webview is reloaded.
				vscode.setState({ text });

				return;
		}
	});

	// Webviews are normally torn down when not visible and re-created when they become visible again.
	// State lets us save information across these re-loads
	const state = vscode.getState();
	if (state) {
		updateContent(state.text);
	}
}());