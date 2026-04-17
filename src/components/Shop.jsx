export default function Shop({handleBuy, upgradesCost, coins, upgradeKeyTitle }) {
    return (
        <>
            <p>{upgradeKeyTitle[1]} Upgrade</p>
            <p>Cost: {upgradesCost[upgradeKeyTitle[0]]} coins.</p>
            <button onClick={() => handleBuy("one", upgradeKeyTitle[0])} disabled={coins < upgradesCost[upgradeKeyTitle[0]]}>Buy</button>
            <button onClick={() => handleBuy("max", upgradeKeyTitle[0])} disabled={coins < upgradesCost[upgradeKeyTitle[0]]}>Buy max</button>
        </>
    )
}