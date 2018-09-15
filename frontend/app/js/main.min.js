document.addEventListener('DOMContentLoaded', () => {

	let rippleTypes = (selector, type = '') => {
		let ripple = selector;

		ripple.forEach((elem) => {
			elem.addEventListener('mousedown', function(event) {
				event.preventDefault();

				let ripple = this.querySelector('.ripple');

				if(ripple) {
					ripple.remove();
				}

				let elemWidth = this.offsetWidth;
				let elemlHeight = this.offsetHeight;
				let equalSize = null;

				if(elemWidth >= elemlHeight) {
					equalSize = elemlHeight;
				}
				else {
					equalSize = elemWidth;
				}

				let x = event.offsetX == 'undefined' ? event.layerX : event.offsetX - equalSize / 2; 
				let y = event.offsetY == 'undefined' ? event.layerY : event.offsetY - equalSize / 2; 

				let newRipple = document.createElement('span');

				newRipple.className = `ripple ${type}`;
				
				let s = newRipple.style;

				s.width = equalSize + 'px';
				s.height = equalSize + 'px';

				s.top = y + 'px';
				s.left = x + 'px';

				this.appendChild(newRipple);	

			});

		});
	};

	rippleTypes(document.querySelectorAll('[data-js="ripple"]'));
	rippleTypes(document.querySelectorAll('[data-js="ripple-primary"]'), 'ripple_primary');
	rippleTypes(document.querySelectorAll('[data-js="ripple-secondary"]'), 'ripple_secondary');
	rippleTypes(document.querySelectorAll('[data-js="ripple-light"]'), 'ripple_light');

});