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
}

export default new Fx();