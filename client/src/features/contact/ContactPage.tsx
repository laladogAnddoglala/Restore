import { Button, ButtonGroup, Typography } from "@mui/material";
import { CounterState, DECREMENT_COUNTER, INCREMENT_COUNTER, decrement, increment } from "./counterReducer";
import { useDispatch, useSelector } from "react-redux";

export default function ContactPage() {
    const dispatch = useDispatch();
    const { data, title } = useSelector((state: CounterState) => state);
    return (
        <>
            <Typography variant='h2'>
                {title}
            </Typography>
            <Typography variant='h2'>
                {data}
            </Typography>
            <ButtonGroup>
                <Button onClick={() => dispatch(decrement())} variant='contained' color='error'>Decrement</Button>
                <Button onClick={() => dispatch(increment())} variant='contained' color='primary'>Increment</Button>
                <Button onClick={() => dispatch(increment(5))} variant='contained' color='secondary'>Increment by 5</Button>
            </ButtonGroup>
        </>
    )
}