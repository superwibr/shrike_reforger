import { request } from "./savfile.js";
import { SaveInteractor } from "./save.js";

const
	requestbtn = document.querySelector("#request"),
	savebtn = document.querySelector("#save"),
	editfield = document.querySelector("#editfield"),
	cdform = document.querySelector("#cdform"),
	cdfield = document.querySelector("#cdfield"),
	upbtn = document.querySelector("#up");

let handle, interactor;

const uicd = function () {
	editfield.value = JSON.stringify(interactor.ctx, null, "\t");
};

requestbtn.addEventListener("click", async function () {
	handle = await request();
	interactor = await SaveInteractor(handle);
	uicd();
});

savebtn.addEventListener("click", () => interactor.up(true));

cdform.addEventListener("submit", function (e) {
	// save any changes first 
	interactor.ctx = JSON.parse(editfield.value);

	interactor.cd(...cdfield.value.split(","));
	cdfield.value = "";
	uicd();
	e.preventDefault();
});

upbtn.addEventListener("click", function(){
	// save any changes first 
	interactor.ctx = JSON.parse(editfield.value);

	interactor.up();
	uicd();
});