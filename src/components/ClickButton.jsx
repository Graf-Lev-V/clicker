export default function ClickButton({ handleClick, clickPower, coinMultiplier, critPower, crit }) {
    return (
        crit ?
        <button onClick={handleClick}>CRIT! +{clickPower * coinMultiplier * critPower}</button> :
        <button onClick={handleClick}>Click +{clickPower * coinMultiplier}</button>
    )
}