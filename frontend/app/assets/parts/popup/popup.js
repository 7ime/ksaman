class Popup {
	constructor(settings) {
		this._settings = settings;
		this._to = this._settings.to;
		this._target = this._settings.target;

		this.init();
	}

	init() {
		this.open(this._to, this._target);
		this.close();
	}

	open(to, target) {
		let all = document.querySelectorAll(`[${to}]`);

		all.forEach(el => {
			el.addEventListener('click', function() {
				if(!this.classList.contains('is_opens')) {
					let checkVisible = document.querySelector('.is_visible');

					if(checkVisible) {
						checkVisible.classList.remove('is_visible');
						document.querySelector('.is_opens').classList.remove('is_opens');
					}
					
					let targetID = this.getAttribute(to);

					this.classList.add('is_opens');
					
					document.querySelector(`[${target} = ${targetID}]`).classList.add('is_visible');
				}
			});
		});
	}

	close() {
		document.addEventListener('click', function(e) {
			if(!e.target.closest('.is_visible') && !e.target.closest('.is_opens')) {
				let checkVisible = document.querySelector('.is_visible');

				if(checkVisible) {
					checkVisible.classList.remove('is_visible');
					document.querySelector('.is_opens').classList.remove('is_opens');
				}
			}
		})
	}
}

document.addEventListener('DOMContentLoaded', function() {

	new Popup({
		to: 'data-popup-to',
		target: 'data-popup' 
	});

})