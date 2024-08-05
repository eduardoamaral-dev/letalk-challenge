interface SimulationResultValueProps {
    value: string | number,
    title: string,
    type: string,
    suffix?: string
}

export default function SimulationResultValue(props: SimulationResultValueProps) {
    return (
        <div>
            <label>{props.title}</label>
            {props.type == "money" ?
                <p className={"dark-n-bold"}>{Number(props.value).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}{props.suffix}</p> :
                <p className={"dark-n-bold"}>{props.value}{props.suffix}</p>
            }
        </div>
    )
}