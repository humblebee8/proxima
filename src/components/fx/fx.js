export default class Fx {
	animations;
	timing;
	delay = 0;
	clean = true;
	retain = true;
	isRunning = false;
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
	cleanUp = ((node) => {
		// retain transform so no cleanup should happen
		if (this.retain.search('transform') < 0) {
			if ('false' !== this.retain) {
				// get values to retain
				let retainerObj = {};
				this.retain.split(', ').forEach((retainProp) => {
					const MATCHES = retainProp.split(/\[(.*?)\]/);
					const RVALUE = this.animations[MATCHES[0]][this.animations[MATCHES[0]].length - 1];
					retainerObj[MATCHES[0]] = RVALUE;
				});
				Object.assign(node.style, retainerObj);
			}

			let text = '';
			Array.from(node.childNodes).forEach((child) => {
				if('A' === child.tagName) {
					const aSpans = child.querySelectorAll('span');
					aSpans.forEach((s) => {
						child.append(s.innerText);
						s.remove();
					});
	
					text += child.outerHTML;
				} else {
					if ('#text' !== child.nodeName) {
						text += 0 === child.innerText.length ? ' ' : child.innerText;
						child.remove();
					} else {
						text = child.textContent;
					}
				}
			});
			node.innerText = text.trim();
		}

		this.isRunning = false;
	});
	animateNode = ((node, options) => {
		if (true === this.isRunning) {
			return;
		}

		if (options.timing.iterations < 1) {
			options.timing.iterations = Infinity;
		}

		this.timing = options.timing;
		this.delay = options.timing.delay;
		this.clean = options.clean;
		this.retain = options.retain;
		this.animations = this.getAnimations(options.animationString);

		if (true === options.split) {
			this.runSplitAnimations(node);
		} else {
			this.runFullAnimations(node);
		}

		this.isRunning = true;
	});
	lastElementCb = ((node, current, last) => {
		if (current === last - 1) {
			this.cleanUp(node);
		}
	});
	runFullAnimations = ((xEl) => {
		xEl.animate(this.animations, this.timing);
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

					anim = SPAN.animate(this.animations, this.timing);
					this.timing.delay = this.timing.delay + this.delay;
				});

				xEl.append(a);
				return;
			}

			if (item instanceof HTMLElement) {
				anim = item.animate(this.animations, this.timing);
                    
				if (true === this.clean) {
					anim.onfinish = ((e) => {
						this.lastElementCb(e.target, index, animTargets.length);
					});
				}
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
					anim = SPAN.animate(this.animations, this.timing);
                    
					if (true === this.clean) {
						anim.onfinish = (() => {
							this.lastElementCb(xEl, index, animTargets.length);
						});
					}
				}
				this.timing.delay = this.timing.delay + this.delay;
			}
		});
	});
}