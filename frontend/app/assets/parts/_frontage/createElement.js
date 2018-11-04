function createElement(tag, props, ...children) {
	const el = document.createElement(tag);

	Object.keys(props).forEach(key => el[key] = props[key]);

	if(children.length > 0) {
		children.forEach(child => {
			if(typeof child === 'string') {
				child = document.createTextNode(child);
			}
			el.appendChild(child)
		})
	}

	return el;
};