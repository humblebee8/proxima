class Fx {
	randomColor = (() => {
		return "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
	});

	getAnimations = ((str) => {
		return str
			.split('|')
			.map(keyVal => {
				return keyVal
					.split(':')
					.map(s => s.trim());
				})
				.reduce((accumulator, currentValue) => {
					accumulator[currentValue[0]] = currentValue[1]
						.replace('[', '')
						.replace(']', '')
						.split(', ').map(val => {
							return val.replace('randomColor', this.randomColor())
						});
					return accumulator;
				}, {});
	});
	runSplitAnimations = ((xEl) => {
		let anim;
		const ANCHOR = xEl.querySelector('a');
		if (null !== ANCHOR) {
			xEl.textContent = xEl.textContent.replace(ANCHOR.innerText, '*');
		}

		const animTargets = xEl.textContent.split('');
		xEl.textContent = '';

		const fontSize = parseFloat(window.getComputedStyle(xEl, null).getPropertyValue('font-size')) || 24

		animTargets.forEach((item, index) => {
			let runAnim = true;

			if ('*' === item) {
				let a = document.createElement('a');
				a.href = ANCHOR.href;
				a.target = ANCHOR.target;
				a.style.textDecoration = 'none';

				const ANCHORLETTERS = ANCHOR.innerText.split('');
				ANCHORLETTERS.forEach((aLetter) => {
					const SPAN = document.createElement('span');
					SPAN.innerText = aLetter;
					SPAN.style.display = 'inline-block';

					if (' ' === item) {
						SPAN.style.width = `${fontSize / 4}px`;
						runAnim = false;
					}
					
					a.append(SPAN);

					anim = SPAN.animate(animationX, timing);
					timing.delay = timing.delay + delay;
				});

				xEl.append(a);
				return;
			}

			if (item instanceof HTMLElement) {
				anim = item.animate(animationX, timing);
			} else {
				const SPAN = document.createElement('span');
				SPAN.innerText = item;
				SPAN.style.display = 'inline-block';
				
				if (' ' === item) {
					SPAN.style.width = `${fontSize / 4}px`;
					runAnim = false;
				}

				xEl.append(SPAN);

				if (true === runAnim) {
					anim = SPAN.animate(animationX, timing);
				}
			}
			timing.delay = timing.delay + delay;
		});
	});
}

export default new Fx();