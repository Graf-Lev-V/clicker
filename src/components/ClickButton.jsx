export default function ClickButton({ handleClick, upgrades, crit }) {
    return (
        crit ?
        <button onClick={handleClick}>CRIT! +{upgrades.clickPower * upgrades.coinMultiplier * upgrades.critPower}</button> :
        <button onClick={handleClick}>Click +{upgrades.clickPower * upgrades.coinMultiplier}</button>
    )
}