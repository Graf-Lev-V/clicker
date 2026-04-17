export default function ClickButton({ handleClick, upgrades }) {
    return (
        <button onClick={handleClick}>Click (+{upgrades.clickPower * upgrades.coinMultiplier} per click)</button>
    )
}