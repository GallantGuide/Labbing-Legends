import { CSSProperties } from "react"

type PlayerListPlayerFilterProps = {
    searchValue: string,
    handleSearchValueChange: (e: any) => void
}

export default function PlayerListPlayerFilter({ searchValue, handleSearchValueChange}: PlayerListPlayerFilterProps) {

    const playerFilterContainerStyle: CSSProperties = {
        marginRight: 10,
    }

    const playerSearchStyle: CSSProperties = {
        minHeight: 25,
        outline: 'none',
        borderRadius: 3,
    }

    return(
        <div className="player-filter" style={playerFilterContainerStyle}>
            <input value={searchValue} placeholder="Search player" onChange={handleSearchValueChange}
                style={playerSearchStyle}
            />
        </div>
    )
}