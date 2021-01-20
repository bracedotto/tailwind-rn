import test from 'ava';
import tailwind, {getColor} from '.';

test('get styles for one class', t => {
	t.deepEqual(tailwind('text-blue-500'), {color: 'rgba(59, 130, 246, 1)'});
});

test('get styles for multiple classes', t => {
	t.deepEqual(tailwind('text-blue-500 bg-blue-100'), {
		color: 'rgba(59, 130, 246, 1)',
		backgroundColor: 'rgba(219, 234, 254, 1)'
	});
});

test('ignore unknown classes', t => {
	t.deepEqual(tailwind('text-blue-500 unknown'), {
		color: 'rgba(59, 130, 246, 1)'
	});
});

test('with media queries and no window width provides', t => {
	t.throws(() => tailwind('text-blue-500 sm:text-gray-100'), {instanceOf: Error});
});

test('with media queries, default should be selected', t => {
	t.deepEqual(tailwind('text-blue-500 sm:text-gray-100', 352), {
		color: 'rgba(66, 153, 225, 1)'
	});
});

test('with media queries, sm should be selected', t => {
	t.deepEqual(tailwind('text-blue-500 sm:text-gray-100', 640), {
		color: 'rgba(247, 250, 252, 1)'
	});
});

test('with media queries, md should be selected', t => {
	t.deepEqual(tailwind('text-blue-500 text-justify sm:text-gray-100', 810), {
		color: 'rgba(247, 250, 252, 1)',
		textAlign: 'justify'
	});
});

test('with media queries, lg should be selected', t => {
	t.deepEqual(tailwind('text-blue-500 text-justify sm:text-gray-100 lg:text-gray-200 xl:text-gray-300', 1024), {
		color: 'rgba(237, 242, 247, 1)',
		textAlign: 'justify'
	});
});

test('with media queries, xl should be selected', t => {
	t.deepEqual(tailwind('text-lg text-blue-500 sm:text-gray-100 md:w-0 md:z-10 lg:w-1 xl:tracking-wide', 1280), {
		color: 'rgba(247, 250, 252, 1)',
		width: 4,
		zIndex: 10,
		fontSize: 18,
		letterSpacing: 0.45
	});
});

test('with media queries, xl should be selected (font size provided)', t => {
	t.deepEqual(tailwind('text-blue-500 sm:text-gray-100 md:w-0 md:z-10 lg:w-1 xl:text-lg xl:tracking-wide', 1280), {
		color: 'rgba(247, 250, 252, 1)',
		width: 4,
		zIndex: 10,
		fontSize: 18,
		letterSpacing: 0.45
	});
});

test('with media queries, all should be selected', t => {
	t.deepEqual(tailwind('text-blue-500 sm:text-gray-100 md:w-0 md:z-10 lg:w-1', 1280), {
		color: 'rgba(247, 250, 252, 1)',
		width: 4,
		zIndex: 10
	});
});

test('with media queries, cannot sort media queries, wider needs to override', t => {
	t.deepEqual(tailwind('z-20 lg:z-10', 1280), {
		zIndex: 10
	});
});

test('support color opacity', t => {
	t.deepEqual(
		tailwind(
			'text-blue-500 text-opacity-50 bg-blue-100 bg-opacity-50 border-blue-100 border-opacity-50'
		),
		{
			color: 'rgba(59, 130, 246, 0.5)',
			backgroundColor: 'rgba(219, 234, 254, 0.5)',
			borderTopColor: 'rgba(219, 234, 254, 0.5)',
			borderRightColor: 'rgba(219, 234, 254, 0.5)',
			borderBottomColor: 'rgba(219, 234, 254, 0.5)',
			borderLeftColor: 'rgba(219, 234, 254, 0.5)'
		}
	);
});

test('ignore non-string values when transforming CSS variables', t => {
	t.deepEqual(tailwind('bg-blue-500 p-12'), {
		backgroundColor: 'rgba(59, 130, 246, 1)',
		paddingTop: 48,
		paddingRight: 48,
		paddingBottom: 48,
		paddingLeft: 48
	});
});

test('get color value', t => {
	t.is(getColor('blue-500'), 'rgba(59, 130, 246, 1)');
});

test('get color with opacity value', t => {
	t.is(getColor('blue-500 opacity-50'), 'rgba(59, 130, 246, 0.5)');
});

test('ignore no value param', t => {
	t.deepEqual(tailwind(null), {});
	t.deepEqual(tailwind(false), {});
	t.deepEqual(tailwind(undefined), {});
	t.deepEqual(tailwind(0), {});
});

test('ignore extra spaces', t => {
	t.deepEqual(tailwind('text-blue-500  bg-blue-100'), {
		color: 'rgba(59, 130, 246, 1)',
		backgroundColor: 'rgba(219, 234, 254, 1)'
	});

	t.deepEqual(
		tailwind(`
		text-blue-500
		bg-blue-100
	`),
		{
			color: 'rgba(59, 130, 246, 1)',
			backgroundColor: 'rgba(219, 234, 254, 1)'
		}
	);
});

test('support font-variant-numeric', t => {
	t.deepEqual(tailwind('oldstyle-nums'), {
		fontVariant: ['oldstyle-nums']
	});

	t.deepEqual(tailwind('lining-nums'), {
		fontVariant: ['lining-nums']
	});

	t.deepEqual(tailwind('tabular-nums'), {
		fontVariant: ['tabular-nums']
	});

	t.deepEqual(tailwind('proportional-nums'), {
		fontVariant: ['proportional-nums']
	});

	t.deepEqual(
		tailwind('oldstyle-nums lining-nums tabular-nums proportional-nums'),
		{
			fontVariant: [
				'lining-nums',
				'oldstyle-nums',
				'proportional-nums',
				'tabular-nums'
			]
		}
	);
});

test('support letter spacing', t => {
	t.deepEqual(tailwind('text-base tracking-tighter'), {
		fontSize: 16,
		letterSpacing: -0.8,
		lineHeight: 24
	});

	t.deepEqual(tailwind('text-base tracking-tight'), {
		fontSize: 16,
		letterSpacing: -0.4,
		lineHeight: 24
	});

	t.deepEqual(tailwind('text-base tracking-normal'), {
		fontSize: 16,
		letterSpacing: 0,
		lineHeight: 24
	});

	t.deepEqual(tailwind('text-base tracking-wide'), {
		fontSize: 16,
		letterSpacing: 0.4,
		lineHeight: 24
	});

	t.deepEqual(tailwind('text-base tracking-wider'), {
		fontSize: 16,
		letterSpacing: 0.8,
		lineHeight: 24
	});

	t.deepEqual(tailwind('text-base tracking-widest'), {
		fontSize: 16,
		letterSpacing: 1.6,
		lineHeight: 24
	});
});
