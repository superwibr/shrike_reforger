const isJsonString = str => {
	try { JSON.parse(str) } catch (e) { return false };
	return true;
};

const layer = (parent, key) => {
	const obj = {
		up(root) {
			if (root === true) return parent.up(true);
			if (typeof root === "number" && root != 0) return parent.up(root - 1);
			return parent;
		},
		cd(...keys) {
			if (keys.length == 0) return this;
			return layer(this, keys.shift()).cd(...keys);
		},
	};

	if (typeof key == 'undefined') {
		obj.ctx = parent;
		obj.up = () => obj;
		parent = obj;
	} else {
		obj.ctx = parent.ctx[key];
	};

	if (isJsonString(parent.ctx[key])) {
		obj.ctx = JSON.parse(parent.ctx[key]);
		const _up = obj.up.bind(obj);
		obj.up = function (root) {
			parent.ctx[key] = JSON.stringify(obj.ctx);
			return _up(root);
		}
	};

	return obj;
};

const LayeredEscapeObject = (obj) => ({
	layer: layer(obj),
	up(root) {
		this.layer = this.layer.up(root);
		return this.layer.ctx
	},
	cd(...keys) {
		this.layer = this.layer.cd(...keys);
		return this.layer.ctx
	},
	get ctx() { return this.layer.ctx },
	set ctx(value) { return this.layer.ctx = value }
});

const SaveInteractor = async function (savres) {
	const savejson = await savres.read();
	return LayeredEscapeObject(savejson);
};

window.lmklayer = LayeredEscapeObject;
export { SaveInteractor };