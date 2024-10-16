import { CSSProperties } from "react"
import { charnameToCardIcon } from "../../Data/Icons/Characters/Cards/CharacterCardIcons"

type PlayerListCharacterFilterProps = {
    charFilterContainer: React.RefObject<HTMLFormElement>,
    characterRefs: React.MutableRefObject<{[key: string]: HTMLDivElement | null}>,
    selectedCharacter: string | null,
    handleCharacterRadioGroupChange: (e: any) => void
    handleCharacterRadioGroupClick: (e: any) => void
}

export default function PlayerListCharacterFilter({
    charFilterContainer, characterRefs, selectedCharacter, handleCharacterRadioGroupChange, handleCharacterRadioGroupClick 
}:
PlayerListCharacterFilterProps
) {
    const characterLabelStyle = (idx: number, isSelected: boolean): CSSProperties => ({
        paddingLeft: idx != 1? 4 : 0,
        filter: !isSelected? 'grayscale(100%)' : 'grayscale(0%)'
    })
    const characterFilterContainerStyle: CSSProperties = {
        display: 'flex', alignItems: 'center',
        overflowX: 'hidden', scrollbarWidth: 'thin', whiteSpace: 'nowrap',
    }
    const characterImgStyle: CSSProperties = {
        height: 35, width: 45,
        borderRadius: 4, border: '1px solid black',
        cursor: 'pointer',
    }

    return(
        <form className="character-filter" ref={charFilterContainer}
            style={characterFilterContainerStyle}
        >
            {Object.keys(charnameToCardIcon).map((charName, idx) => {
                    if(charName == "Random") return ""
                    const isSelected = selectedCharacter === charName
                    return(
                        <div ref={(el) => characterRefs.current[charName] = el} key={idx} style={characterLabelStyle(idx, isSelected)}>
                            <input type="radio" id={charName} style={{display: 'none'}}
                                checked={isSelected}
                                value={charName}
                                onChange={handleCharacterRadioGroupChange} onClick={handleCharacterRadioGroupClick}
                            />
                            <label htmlFor={charName} style={{display: 'flex'}}>
                                <img src={charnameToCardIcon[charName]} alt={charName} style={characterImgStyle} draggable={false}/>
                            </label>
                        </div>
                    )
            })}
        </form>
    )
}