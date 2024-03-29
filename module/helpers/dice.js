export async function RollTest({
    numberOfDice = 2,
    numberOfSides = 6,
    defaultThreshold = 5,
    focusAction = false,
    initThrow = false,
    marksmanTrait = false } = {}) {

    let threshold = defaultThreshold;
    if (focusAction && (focusAction === 'true'))
    {
        threshold = threshold - 1;
    }

    if (marksmanTrait && (marksmanTrait === 'true'))
    {
        threshold = threshold - 1;
    }

    if (!initThrow) {
        const rollForumla = `${numberOfDice}d${numberOfSides}cs>=${threshold}`;
        let result = await new Roll(rollForumla, {}).evaluate({'async': true})
        let renderedRoll = await renderTemplate("systems/tinyd6/templates/partials/test-result.hbs", { rollResult: result });
        chatInfo(result, renderedRoll);
    }
    if (initThrow === "true") {
        let result = await new Roll('1d6 + 1d6').evaluate({'async': true});
            // Execute the roll
        // let renderedRoll = await result.render({ result: result, template: "systems/tinyd6/templates/partials/test-result.hbs" });
        let renderedRoll = await renderTemplate("systems/tinyd6/templates/tiny-dungeon/partials/init-result.hbs", { rollResult: result });
        chatInfo(result, renderedRoll);
    }

}

function chatInfo(result, renderedRoll) {
    const chatData = {
        speaker: ChatMessage.getSpeaker(),
        content: renderedRoll
    };
    
    result.toMessage(chatData);
}

export function setFocusOption(form, element) {
    form.find(".die-roller > .roll-dice").each((n, tag) => {
        tag.dataset.enableFocus = element.checked
    });

    if (element.checked)
    {
        form.find(".action-modifiers .toggle-marksman").prop("disabled", false);
    }
    else
    {
        const marksmanElement = form.find(".action-modifiers .toggle-marksman");
        marksmanElement.prop("checked", false);
        marksmanElement.prop("disabled", true);
    }
}

export function setMarksmanOption(form, element)
{
    form.find(".die-roller > .roll-dice").each((n, tag) => {
        tag.dataset.enableMarksman = element.checked;
    });
}

export function diceToFaces(value, content)
{
    switch (value)
    {
        case 1:
            return "fa-dice-one";
        case 2:
            return "fa-dice-two";
        case 3:
            return "fa-dice-three";
        case 4:
            return "fa-dice-four";
        case 5:
            return "fa-dice-five";
        case 6:
            return "fa-dice-six";
    }

    return "fa-dice-d6";
}