export default function ClickButton({ handleClick, upgrades }) {
    return (
        <button onClick={handleClick}>Click (+{upgrades.clickPower} per click)</button>
    )
}