// Desc: Toggle Switch Component
// A toggle switch component that can be used to toggle between two states. It accepts the following props:
// name: The name of the input element.
// onChange: The function to call when the input value changes.
// label: The label to display next to the switch.
// checked: The initial state of the switch.
// disable: Whether the switch is disabled or not.

export default function ToggleSwitch({
	name,
	onChange,
	label,
	checked,
	disable,
	color,
}) {
	return (
		<label className='w-fit flex items-center gap-2 cursor-pointer'>
			<input
				type='checkbox'
				name={name || ''}
				disabled={disable}
				checked={checked}
				className='sr-only peer'
				onChange={onChange}
			/>
			<div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-green-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
			{label && (
				<span className='min-w-12 text-sm font-medium text-gray-900 dark:text-gray-300'>
					{label}
				</span>
			)}
		</label>
	)
}
