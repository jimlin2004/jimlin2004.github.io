class FSMState
{
    constructor(name, from, to, onEvent)
    {
        this.name = name;
        this.from = from;
        this.to = to;
        this.onEvent = onEvent;
    }
};

class FSM
{
    constructor()
    {
        this.states = new Map();
        this.current = null;
    }
    setInit(stateName)
    {
        this.current = stateName;
    }
    create(state)
    {
        if (this.states.has(state.name))
        {
            let targetState = this.states.get(state.name);
            targetState.from.push(state.from);
            targetState.to.push(state.to);
        }
        else
            this.states.set(state.name, {from: [state.from], to: [state.to], onEvent: state.onEvent});
    }
    to(toState)
    {
        for (let stateName of this.states.get(this.current).to)
        {
            if (stateName === toState)
            {
                this.current = stateName;
                return;
            }
        }
        console.log("Cannot transit from %s to %s", this.current, toState);
    }
    triggerEvent()
    {
        let state = this.states.get(this.current);
        if (state.onEvent !== null)
            state.onEvent();
    }
};

export {FSMState, FSM};
// test
// let fsm = new FSM();
// fsm.create(new FSMState("s0", "s0", "s1", () => {console.log("On s0")}));
// fsm.create(new FSMState("s0", "s0", "s2", null));
// fsm.create(new FSMState("s1", "s0", "s2", () => {console.log("On s1")}));
// fsm.create(new FSMState("s2", "s1", "s0", () => {console.log("On s2")}));

// fsm.setInit("s0");
// fsm.triggerEvent();
// console.log(fsm.current);
// fsm.to("s1");
// fsm.triggerEvent();
// console.log(fsm.current);
// fsm.to("s0");
// fsm.triggerEvent();
// console.log(fsm.current);
// fsm.to("s2");
// fsm.triggerEvent();
// console.log(fsm.current);
// fsm.to("s1");
// fsm.triggerEvent();
// console.log(fsm.current);
// fsm.to("s0");
// fsm.triggerEvent();
// console.log(fsm.current);