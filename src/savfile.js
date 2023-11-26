import pako from "./pako.min.js";

if (typeof window.showOpenFilePicker !== 'function') {
	alert("This tool relies on features of the File System API your browser does not support or doesn't have enabled.")
}

const request = async function () {
	// Open file picker and destructure the result the first handle
	const [fileHandle] = await window.showOpenFilePicker({
		types: [
			{
				description: "DEFLATE data file",
				accept: {
					"application/octet-stream": [".sav"],
				},
			},
		],
		excludeAcceptAllOption: true,
		multiple: false,
	});
	return {
		fileHandle,
		async read(){
			return JSON.parse(new TextDecoder().decode(pako.inflateRaw(await (await fileHandle.getFile()).arrayBuffer())));
		},
		async write(json){
			const data = pako.deflateRaw(new TextEncoder().encode(JSON.stringify(json)));
			const writable = await fileHandle.createWritable();
			await writable.write(data);
			await writable.close();
		}
	};
}

export { request };