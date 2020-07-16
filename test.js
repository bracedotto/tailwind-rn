import test from 'ava';
import tailwind, {getColor} from '.';

test('get styles for one class', t => {
	t.deepEqual(tailwind('text-blue-500'), {color: 'rgba(66, 153, 225, 1)'});
});

test('get styles for multiple classes', t => {
	t.deepEqual(tailwind('text-blue-500 bg-blue-100'), {
		color: 'rgba(66, 153, 225, 1)',
		backgroundColor: 'rgba(235, 248, 255, 1)'
	});
});

test('ignore unknown classes', t => {
	t.deepEqual(tailwind('text-blue-500 unknown'), {
		color: 'rgba(66, 153, 225, 1)'
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
	t.deepEqual(tailwind('text-blue-500 sm:text-gray-100 md:w-0 md:z-10 lg:w-1 xl:tracking-wide', 1280), {
		color: 'rgba(247, 250, 252, 1)',
		width: 4,
		zIndex: 10,
		letterSpacing: '0.025em'
	});
});

test('with media queries, all should be selected', t => {
	t.deepEqual(tailwind('text-blue-500 sm:text-gray-100 md:w-0 md:z-10 lg:w-1', 1280), {
		color: 'rgba(247, 250, 252, 1)',
		width: 4,
		zIndex: 10
	});
});

test('support color opacity', t => {
	t.deepEqual(
		tailwind(
			'text-blue-500 text-opacity-50 bg-blue-100 bg-opacity-50 border-blue-100 border-opacity-50'
		),
		{
			color: 'rgba(66, 153, 225, 0.5)',
			backgroundColor: 'rgba(235, 248, 255, 0.5)',
			borderTopColor: 'rgba(235, 248, 255, 0.5)',
			borderRightColor: 'rgba(235, 248, 255, 0.5)',
			borderBottomColor: 'rgba(235, 248, 255, 0.5)',
			borderLeftColor: 'rgba(235, 248, 255, 0.5)'
		}
	);
});

test('ignore non-string values when transforming CSS variables', t => {
	t.deepEqual(tailwind('bg-blue-500 p-12'), {
		backgroundColor: 'rgba(66, 153, 225, 1)',
		paddingTop: 48,
		paddingRight: 48,
		paddingBottom: 48,
		paddingLeft: 48
	});
});

test('get color value', t => {
	t.is(getColor('blue-500'), 'rgba(66, 153, 225, 1)');
});

test('ignore no value param', t => {
	t.deepEqual(tailwind(null), {});
	t.deepEqual(tailwind(false), {});
	t.deepEqual(tailwind(undefined), {});
	t.deepEqual(tailwind(0), {});
});

test('ignore extra spaces', t => {
	t.deepEqual(tailwind('text-blue-500  bg-blue-100'), {
		color: 'rgba(66, 153, 225, 1)',
		backgroundColor: 'rgba(235, 248, 255, 1)'
	});

	t.deepEqual(tailwind(`
		text-blue-500
		bg-blue-100
	`), {
		color: 'rgba(66, 153, 225, 1)',
		backgroundColor: 'rgba(235, 248, 255, 1)'
	});
});
