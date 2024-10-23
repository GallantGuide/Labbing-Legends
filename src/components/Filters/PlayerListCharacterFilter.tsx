import { CSSProperties, useEffect } from "react"
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
    // Preload images
    useEffect(() =>{
        Object.values(charnameToCardIcon).forEach((imageUrl) => {
            const img = new Image()
            img.src = imageUrl
        })
    }, [])

    const characterLabelStyle = (idx: number, isSelected: boolean): CSSProperties => ({
        // paddingLeft: idx != 1? 4 : 0,
        filter: (!isSelected && selectedCharacter)? 'grayscale(100%)' : 'grayscale(0%)'
    })

    const characterFilterContainerStyle: CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 0fr)', gridTemplateRows: 'repeat(6, 0fr)',
        columnGap: 5, rowGap: 5,

        backgroundColor: '#1c1e22',
        border: '1px solid rgb(65, 63, 63)',
        borderRadius: '9px',

        boxSizing: 'border-box',

        padding: 3,
        marginTop: 10

        // //FIXME: Bad solution for now
        // position: 'absolute',
        // left: 'calc(50% + 500px)', // 500px is half the width of table
    }
    const characterImgStyle = (idx:number, isSelected: boolean): CSSProperties => ({
        height: 45, width: 55,

        borderRadius: 9, 
        border: !isSelected? '1px solid black' : '1px solid #146DD1FF',

        boxSizing: 'border-box',
        cursor: 'pointer',
    })

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
                                <img src={charnameToCardIcon[charName]} title={charName} alt={charName} style={characterImgStyle(idx, isSelected)} draggable={false}/>
                            </label>
                        </div>
                    )
            })}
        </form>
    )
}