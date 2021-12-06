# 💫PROXIMA

proxima is an FX library for astro built on top of [X-Element](https://github.com/aFuzzyBear/astro-ui/tree/main/components/XElement) you can animate any textnode letter by letter and any node as is provided a simple string passed into the animations property.

## examples

```html
---
	import Headline from "../components/headline/headline.astro";
---
<html lang="en">

<head>
	<meta charset="utf-8" />
	<link rel="icon" type="image/x-icon" href="/favicon.ico" />
	<meta name="viewport" content="width=device-width" />
	<title>Welcome to Proxima</title>
</head>
<body>
	<div style="width: 100%;">
		<Headline 
			class="red"
			iterations="4"
			easing="cubic-bezier(0.390, 0.575, 0.565, 1.000)"
			animations="color: [#f4fc05, randomColor, randomColor, randomColor, randomColor, randomColor, randomColor] | transform: [translateX(10%), translateY(20%), rotate(360deg), scale(0.75), rotate(45deg)]"
		>
				Headline h1
		</Headline>
	</div>
	<div style="width:100%;">
		<Headline 
			type="h2"
			class="blue"
			gradient="to right, green, blue, red, yellow"
			iterations="1"
			direction="alternate-reverse"
			delay="1000"
			animations="opacity: [0]"
		>
				Headline h2
		</Headline>
	</div>
	<div style="width:100%;">
		<Headline 
			type="h3"
			class="blue"
			delay="300"
			duration="3000"
			iterations="3"
			fullNode="false"
			animations="color: [#f4fc05, randomColor, randomColor, randomColor, randomColor, randomColor, randomColor] | transform: [translateX(10%), translateY(20%), scale(0.75), rotate(180deg)]"
		>
				<a href="https://github.com/p13rnd/proxima">PROXIMA</a>
		</Headline>
	</div>
	<div style="width:100%;">
		<Headline 
			type="h4"
			class="red"
			delay="4000"
			iterations="1"
			animations="opacity: [0]"
		>
				Headline h4
		</Headline>
	</div>
	<div style="width:100%;">
		<Headline 
			type="h5"
			class="blue"
			delay="300"
			iterations="1"
			fullNode="false"
			animations="opacity: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]"
		>
				Headline h5
		</Headline>
	</div>
	<div style="width:100%;">
		<Headline 
			type="h6"
			style="opacity:0;"
			class="blue"
			delay="2000"
			iterations="1"
			animations="opacity: [1]"
		>
				Headline h6
		</Headline>
	</div>
</body>

</html>

<style>
	h1 {
		font-size: 4rem;
	}
	h2 {
		font-size: 3.5rem;
	}
	h3 {
		font-size: 3rem;
	}
	h4 {
		font-size: 2.5rem;
	}
	h5 {
		font-size: 2rem;
	}
	h6 {
		font-size: 1.5rem;
	}
	.red {
		color: red;
	}
	.blue {
		color: blue;
	}
</style>
```

## TODO: more detailed documentation