
interface SimulationResultValueProps {
    value: string | number,
    title: string
}

export default function SimulationResultValue(props: SimulationResultValueProps){
    return (
        <div>
            <label>{props.value}</label>
            <p>{props.value}</p>
        </div>
    )
}