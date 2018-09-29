document.addEventListener('DOMContentLoaded', function() {

	document.querySelector('[data-js="menu-open"]').addEventListener('click', function(event) {
		memuToggle()
	});

	document.querySelector('[data-js="dimmer"]').addEventListener('click', function(event) {
		memuToggle()
	});
	
	function memuToggle() {
		document.querySelector('[data-js="dimmer"]').classList.toggle('is_active');
		document.querySelector('[data-js="menu-open"]').classList.toggle('is_active');
		document.querySelector('body').classList.toggle('menu-open');
	};


	let mobileDropdown = document.querySelectorAll('[data-js="mobile-dropdown"]')

	mobileDropdown.forEach(el => {
		el.addEventListener('click', function(){
			this.classList.toggle('is_active');
		});
	});

	
});