import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import {  EventConfiguration } from "../../components/EventOrganizer"
import { RootState } from "../store"


const initialState: EventConfiguration[] = []
export const eventConfigSlice = createSlice({
    name: "EventConfiguration",
    initialState,
    reducers: {
        addConfiguration: (state, action: PayloadAction<EventConfiguration>) => {
                return [...state, action.payload]
        },
       

       
    }
})
export const { addConfiguration } = eventConfigSlice.actions

export default eventConfigSlice.reducer
export const selectEventConfig = (state: RootState) => state.eventConfig
