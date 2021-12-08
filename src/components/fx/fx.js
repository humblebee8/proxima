export default class Fx {
	animations;
	timing;
	delay = 0;
	delayBetweenLetters = 0;
	clean = true;
	node;
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
		if ('false' !== this.retain) {
			this.retain += ', inline-block';
			// get values to retain
			let retainerObj = {};
			this.retain.split(', ').forEach((retainProp) => {
				const MATCHES = retainProp.split(/\[(.*?)\]/);
				if (undefined !== this.animations[MATCHES[0]]) {
					const RVALUE = this.animations[MATCHES[0]][this.animations[MATCHES[0]].length - 1];
					retainerObj[MATCHES[0]] = RVALUE;
				} else {
					// check if inline block should be retained
					if ('inline-block' === MATCHES[0]) {
						retainerObj = Object.assign(retainerObj, {
							display: 'inline-block'
						});
					}
				}
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
		node.innerHTML = text.trim();

		this.isRunning = false;
	});
	animateNode = ((node, options) => {
		if (true === this.isRunning) {
			return;
		}

		if (options.timing.iterations < 1) {
			options.timing.iterations = Infinity;
		}

		this.node = node;
		this.delayBetweenLetters = options.delayBetweenLetters;
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
		const textInWords = xEl.textContent.split(' ');
		const ANCHOR = xEl.querySelector('a');
		if (null !== ANCHOR) {
			xEl.textContent = xEl.textContent.replace(ANCHOR.innerText, '*');
		}

		const animTargets = xEl.textContent.split('');
		xEl.textContent = '';

		const fontSize = parseFloat(window.getComputedStyle(xEl, null).getPropertyValue('font-size')) || 24
		const containerWidth = xEl.clientWidth;
		let currentWordIndex = 0, 
			currentWord = textInWords[currentWordIndex], 
			isLastWord = false,
			nextWord = '', 
			currentLineLen = 0;
		console.log(textInWords);
		animTargets.forEach((item, index) => {
			let runAnim = true;
			if ('*' === item) {
				let a = document.createElement('a');
				a.href = ANCHOR.href;
				a.target = ANCHOR.target;
				a.style.textDecoration = 'none';

				// SPAN BEFORE
				const SPANBEFORE = document.createElement('span');
				SPANBEFORE.style.display = 'inline-block';
				SPANBEFORE.style.width = `${fontSize / 3.65}px`;
				a.append(SPANBEFORE);

				const ANCHORLETTERS = ANCHOR.innerText.split('');
				ANCHORLETTERS.forEach((aLetter) => {
					const SPAN = document.createElement('span');
					SPAN.innerText = aLetter;
					SPAN.style.display = 'inline-block';

					if (' ' === item) {
						SPAN.style.width = `${fontSize / 3.65}px`;
						runAnim = false;
					}
					
					a.append(SPAN);

					anim = SPAN.animate(this.animations, {
						duration: this.timing.duration,
						easing: this.timing.easing,
						fill: this.timing.fill,
						direction: this.timing.direction,
						iterations: this.timing.iterations,
						delay: this.timing.delay + this.delayBetweenLetters * (index + 1)
					});
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
				// maybe space or control character
				const isLetter = RegExp(/^\p{L}/,'u').test(item);
				
				// console.log(containerWidth)
				const SPAN = document.createElement('span');
				SPAN.style.display = 'inline-block';
				SPAN.innerText = item;
				
				if (' ' === item) {
					SPAN.innerText = '';					
					SPAN.style.width = `${fontSize / 3.65}px`;
					runAnim = false;
					currentWordIndex++;
					if (undefined !== textInWords[currentWordIndex]) {
						currentWord = textInWords[currentWordIndex];
					} else {
						currentWord = currentWord;
						isLastWord = true;
					}
				}
				
				// do snake parse
				if (isLetter || ' ' === item) {
					const CALCULATED_WIDTH = this.snakeParse(xEl, SPAN.cloneNode(true));
					currentLineLen += CALCULATED_WIDTH;
					console.log("LETTER WIDTH", currentLineLen, animTargets[index + 1], currentWord);
				}
				xEl.append(SPAN);

				if (true === runAnim) {
					anim = SPAN.animate(this.animations, {
						duration: this.timing.duration,
						easing: this.timing.easing,
						fill: this.timing.fill,
						direction: this.timing.direction,
						iterations: this.timing.iterations,
						delay: this.timing.delay + this.delayBetweenLetters * (index + 1)
					});
                    
					if (true === this.clean) {
						anim.onfinish = (() => {
							anim.pause();
							this.lastElementCb(xEl, index, animTargets.length);
						});
					}
				}
			}
		});
	});
	snakeParse = ((xEl, el) => {
		// append el invisible, measure it's width and remove it right away
		el.style.visibility = 'hidden';
		xEl.append(el);
		let w = el.clientWidth;
		xEl.removeChild(el);
		
		return w;
	});
}