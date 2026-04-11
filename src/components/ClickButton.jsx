export default function ClickButton({ handleClick, clickPower }) {
    return (
        <button onClick={handleClick}>Click (+{clickPower} per click)</button>
    )
}