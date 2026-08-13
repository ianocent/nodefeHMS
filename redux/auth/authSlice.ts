// authSlice
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const initialState = {
  isLogin: "",
  datas: "",
  permissions: {},
  roles: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<any>) => {
      state.isLogin = action.payload;
    },
    setDatas: (state, action: PayloadAction<any>) => {
      state.datas = action.payload;
    },
    setPermissions: (state, action: PayloadAction<any>) => {
      state.permissions = action.payload;
    },
    setRoles: (state, action) => {
      state.roles = action.payload;
    }
  },
});

export const { setLogin, setDatas, setPermissions, setRoles } = authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer;
