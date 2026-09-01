import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
  Textarea,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel
} from "@material-tailwind/react";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Logout,
  GetLocaData,
  FetchData,
  GetEncrypt,
  GetDecrypt,
  RouteChange,
  GetCurrentDate,
  GetQueryParam,
} from "../../../../helper";
import ButtonSubmit from "../../../button/ButtonSubmit";
import { LayoutContext } from "../../../../../context/LayoutContext";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../../../../../redux/auth/authSlice";
import InputMain from "../../../input/InputMain";
import { env } from "../../../../../next.config";

const Profile = () => {
  let navigate = useRouter();
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLogin } = useSelector((state: any) => state?.auth);
  // const datalocal: any = JSON.parse(GetDecrypt(isLogin));
  let datalocal: any = null;
  try {
    const decrypted = GetDecrypt(isLogin);
    datalocal = decrypted ? JSON.parse(decrypted) : null;
  } catch (error) {
    datalocal = null;
  }
  const [datajsonp, setdatajsonp] = useState<any>();
  const [open, setopen] = useState(false);
  const handleOpen = () => {
    {
      setopen(!open);
    }
  };
  const openChangePass = () => setopen(true);
  const [passwordshow1, setpasswordshow1] = useState(false);
  const [passwordshow2, setpasswordshow2] = useState(false);
  const [passwordshow3, setpasswordshow3] = useState(false);
  const [disabledbtn, setdisablebtn] = useState(true);
  const [err, seterr] = useState("");
  const [errnewpass, seterrnewpass] = useState("");
  const [errconfirmpass, seterrconfirmpass] = useState("");

  const [loading, setloading] = useState(false);
  const [alert, setalert] = useState(false);
  const [data, setData] = useState({
    email: "admin1@profesmail.com",
    password: "",
    password2: "",
    password3: "",
  });
  const { email, password, password2, password3 } = data;
  const changeHandler = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
    // setError("");
  };
  const onChangePass = async () => {
    let valid = false;
    if (errconfirmpass == "" && errnewpass == "") {
      valid = true;
    }
    if (valid) {
      const raw = JSON.stringify({
        username: datajsonp?.data?.username,
        current_password: password3,
        new_password: password2,
      });
      const aesraw = GetEncrypt(raw);
      const datares: any = FetchData(
        "/cms/change-password",
        "POST",
        aesraw,
        false,
        datajsonp?.data?.access_token,
        navigate,
        ""
      );
      const dataresfix = await datares;
      if (dataresfix?.code == "400") {
        setloading(false);
        seterr(dataresfix?.message);
        setalert(true);
      } else {
        setloading(false);
      }
    }
  };
  const StartShift = async () => {
    let valid = false;
    if (errconfirmpass == "" && errnewpass == "") {
      valid = true;
    }
    if (valid) {
      const raw = JSON.stringify({
        body: "",
      });
      const aesraw = GetEncrypt(raw);
      const datares: any = FetchData(
        "/cms/shift/start",
        "POST",
        aesraw,
        false,
        datajsonp?.data?.access_token,
        navigate,
        ""
      );
      const dataresfix = await datares;
      if (dataresfix?.code == "200") {
        dispatch(setLogin(GetEncrypt(JSON.stringify(dataresfix))));
        // router.push(window.location.href);
      }
    }
  };
  const CallLogout = () => {
    Logout("", "POST", "", datalocal?.data?.access_token, router, dispatch);
  };
  const validatePassword = () => {
    let num = 0;
    if (password2.length >= 7) {
      num = num + 1;
      // console.log("7");
    }
    if (password2.length < 14) {
      // console.log("14");
      num = num + 1;
    }
    if (/[A-Z]/.test(password2)) {
      // console.log("A");
      num = num + 1;
    }

    if (/[a-z]/.test(password2)) {
      // console.log("a");
      num = num + 1;
    }

    if (/[0-9]/.test(password2)) {
      // console.log("9");
      num = num + 1;
    }

    if (/[.*+@#?^${}()|[\]\\]/.test(password2)) {
      // console.log("@");
      num = num + 1;
    }
    // console.log(num);
    if (num != 6) {
      seterrnewpass(
        "⁠Minimal 7 character, Maximal 14 character,  The password should contain a combination of letters, numbers, and symbols"
      );
    } else {
      seterrnewpass("");
    }
  };
  const confirmPassword = () => {
    if (password != password2) {
      seterrconfirmpass("Password doesn't match");
      //setdisablebtn(false);
    } else {
      seterrconfirmpass("");
    }
  };
  const [date, setdate] = useState(GetCurrentDate());

  const getBusinessDate = async () => {
    try {
      let urisave = "/cms/night-audit/audit";
      let mth = "GET";

      const saveprocess = await FetchData(
        urisave,
        mth,
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
      if (saveprocess?.code == "200") {
        let date = new Date(saveprocess?.data?.date);
        /* Date format you have */
        let dateMDY = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        /* Date converted to MM-DD-YYYY format */

        setdate(dateMDY);
      }
    } catch (error) {}
  };

  const onCreateTask = async () => {
    setloading(true);
    try {
      const payload: any = {
        room: taskData.room || undefined,
        type: taskData.type,
        status: taskData.type === "Messages" ? null : taskData.status,
        createdOn: taskData.createdOn,
        assignType: taskData.assignType,
        message: taskData.message,
      };
  
      if (taskData.assignType === "user") {
        payload.to_user_id = taskData.to_user_id;
      } else if (taskData.assignType === "role") {
        payload.to_role_id = taskData.to_role_id;
      }
  
      const raw = JSON.stringify(payload);
      const aesraw = GetEncrypt(raw);
  
      const response: any = await FetchData(
        "/cms/task",
        "POST",
        aesraw,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
  
      if (response?.code === "200") {
        handleOpenTask();
        // Optional: reset form
        setTaskData({
          room: "",
          assignType: "user",
          type: "Task",
          status: "Open",
          createdOn: GetCurrentDate(),
          to_user_id: "",
          to_role_id: "",
          message: "",
        });
      } else {
        console.error("Gagal simpan task:", response?.message);
      }
    } catch (error) {
      console.error("Error saat simpan task:", error);
    } finally {
      setloading(false);
    }
  };

  const [openTask, setOpenTask] = useState(false);
  const handleOpenTask = () => setOpenTask(!openTask);

  const [taskOptions, setTaskOptions] = useState<any>({
    users: [],
    roles: [],
    // departments: [],
  });
  
  const [taskData, setTaskData] = useState({
    room: "",
    assignType: "user",
    type: "Task",
    status: "Open",
    createdOn: GetCurrentDate(),
    // from: "",
    to_user_id: "",
    to_role_id: "",
    // department: "",
    message: "",
  });
  
  const taskChangeHandler = (e: any) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };
  
  const fetchTaskOptions = async () => {
    try {
      // Users
      const userResponse: any = await FetchData(
        "/cms/uall",
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
  
      let users = [];
      if (userResponse?.code === 200 && Array.isArray(userResponse?.data)) {
        users = userResponse.data.map((u: any) => ({
          value: String(u.id || u.user_id || ''),
          label: u.name || u.username || `User ${u.id}`,
        }));
      }
  
      // Roles
      const roleResponse: any = await FetchData(
        "/cms/rall",
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
  
      let roles = [];
      if (roleResponse?.code === 200 && Array.isArray(roleResponse?.data)) {
        roles = roleResponse.data.map((r: any) => ({
          value: String(r.id || ''),
          label: r.name || r.display_name || `Role ${r.id}`,
        }));
      }
  
      setTaskOptions({
        users,
        roles,
      });
  
    } catch (error) {
      console.error("Error fetching task options:", error);
    }
  };

  const [activeTab, setActiveTab] = useState<"create" | "manage">("create");
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const res: any = await FetchData(
        "/cms/task",  // ← PASTIKAN PAKAI INI (bukan /cms/task?parent_id=null)
        "GET",
        "",
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
  
      if (res?.code !== 200) {
        console.warn("Gagal ambil task:", res);
        setTasks([]);
        return;
      }
  
      const taskList = Array.isArray(res.data) 
        ? res.data 
        : res.data?.data || res.data?.items || [];
  
      setTasks(
        taskList.map((t: any) => ({
          id: t.id,
          from: t.from || t.creator?.name || "—",
          message: t.message || "",
          room_number: t.room_number || "-",
          status: t.status || (t.type === "Messages" ? "—" : "Open"),
          created_at: t.created_at || "",
          is_read: !!t.is_read,          // ← ini yang penting, dari backend per user
          duration: t.duration || "-",   // ← optional, kalau backend kirim
          type: t.type || "Task",
        }))
      );
    } catch (err) {
      console.error("Fetch tasks error:", err);
      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };
  
  const markAsRead = async (taskId: number) => {
    try {
      const res: any = await FetchData(
        `/cms/task/${taskId}/read`,
        "PUT",
        GetEncrypt(JSON.stringify({})),
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
  
      if (res?.code === 200) {
        setTasks(prev =>
          prev.map(t =>
            t.id === taskId ? { ...t, is_read: true } : t
          )
        );
      } else {
        console.warn("Mark as read gagal:", res);
      }
    } catch (err) {
      console.error("Error mark as read:", err);
    }
  };

  const handleStatusChange = async (taskId: number | string, newStatus: string) => {
    if (!newStatus) return;
  
    try {
      // Optional: konfirmasi jika mau close
      if (newStatus === "Closed") {
        if (!window.confirm("Are you sure you want to close this task?")) {
          return;
        }
      }
  
      const payload = JSON.stringify({ status: newStatus });
      const encryptedPayload = GetEncrypt(payload);
  
      const response: any = await FetchData(
        `/cms/task/${taskId}`,  // asumsi endpoint PUT /cms/task/{id}
        "PUT",
        encryptedPayload,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
  
      if (response?.code === 200) {
        // Refresh list setelah sukses
        fetchTasks();
      } else {
        console.error("Failed to update status:", response?.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const [openReply, setOpenReply] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);


  const handleOpenReply = async (taskFromList: any) => {
    if (!taskFromList?.id) return;
  
    try {
      const threadRes = await FetchData(
        `/cms/task/${taskFromList.id}/thread`,
        "GET",
        "", 
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
  
      if (threadRes?.code === 200) {
        const { task, replies } = threadRes.data;
  
        setSelectedTask({
          ...task,
          from: task.from || task.creator?.name || 'Pengirim Tidak Diketahui',
        });
  
        setReplies(replies || []);
        setReplyMessage('');
      } else {
        console.warn("Thread fetch gagal, pakai data list sementara");
        setSelectedTask({
          ...taskFromList,
          from: taskFromList.from || 'Unknown',
        });
        setReplies([]);
      }
    } catch (error) {
      console.error("Gagal load thread:", error);
      setSelectedTask({
        ...taskFromList,
        from: taskFromList.from || 'Unknown',
      });
      setReplies([]);
    }
  };

  const sendReply = async () => {
    if (!replyMessage.trim() || !selectedTask) return;
  
    try {
      const payload = JSON.stringify({ message: replyMessage });
      const encrypted = GetEncrypt(payload);
  
      const res = await FetchData(
        `/cms/task/${selectedTask.id}/reply`,
        "POST",
        encrypted,
        false,
        datalocal?.data?.access_token,
        router,
        ""
      );
  
      if (res?.code === 200) {
        setReplyMessage('');
        // Refresh thread
        const threadRes = await FetchData(
          `/cms/task/${selectedTask.id}/thread`,
          "GET",
          "",
          false,
          datalocal?.data?.access_token,
          router,
          ""
        );
        if (threadRes?.code === 200) {
          setReplies(threadRes.data.replies || []);
        }
        fetchTasks(); // refresh list utama
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [replies, setReplies] = useState([]);
  const [repliesLoading, setRepliesLoading] = useState(false);

  useEffect(() => {
    if (openReply && selectedTask) {
      const fetchThread = async () => {
        setRepliesLoading(true);
        try {
          const res = await FetchData(
            `/cms/task/${selectedTask.id}/thread`,
            "GET",
            "",
            false,
            datalocal?.data?.access_token,
            router,
            ""
          );
          if (res?.code === 200) {
            setReplies(res.data.replies || []);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setRepliesLoading(false);
        }
      };
      fetchThread();
    }
  }, [openReply, selectedTask]);


  useEffect(() => {
    getBusinessDate();
    setdatajsonp(datalocal);
    fetchTaskOptions();
  }, []);
  // Keep datajsonp in sync when login data changes (e.g. after shift start)
  useEffect(() => {
    setdatajsonp(datalocal);
  }, [isLogin]);
  useEffect(() => {
    if (openTask && activeTab === "manage") {
      fetchTasks();
    }
  }, [openTask, activeTab]);

  const currentUserName = 
    datalocal?.data?.name || 
    datalocal?.data?.username || 
    "Current User";

  const currentUserId = 
    datalocal?.data?.id || 
    datalocal?.data?.user_id || 
    null;

  const isChoosePropertyPage = 
    router.pathname === "/choose-property" ||
    router.asPath.includes("/choose-property") ||
    GetQueryParam(0) === "choose-property";

  const showPropertyMenus = !isChoosePropertyPage && !!datajsonp?.name && datajsonp.name.trim() !== "";
  
  return (
    <>
      <Menu>
      <div className="flex items-center justify-between p-1 rounded-xl transition-all duration-200">
        <div className="hidden md:flex flex-1 flex-col items-center justify-center">
          <div className="font-semibold text-gray-900 uppercase tracking-wider">
            {datajsonp?.data?.name}
          </div>
          {/* desktop */}
          {datalocal?.data?.is_need_shift && GetQueryParam(0) !== "choose-property" ? (
            <button
              onClick={() => {
                if (datalocal?.data?.is_shift) {
                  window.location.assign("/endshift?parent=");
                } else {
                  StartShift();
                }
              }}
              className={`flex items-center gap-3 px-5 py-0.5 font-semibold rounded-lg tracking-widertransition-all ${
                datalocal?.data?.is_shift
                  ? "bg-green text-white hover:bg-green-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {datalocal?.data?.is_shift ? "END SHIFT" : "START SHIFT"}
            </button>
          ) : (
            <div className="text-gray-500 text-sm">
              {datajsonp?.NameProperty}
            </div>
          )}
        </div>

        <div className="relative md:ml-5">
          <MenuHandler>
            <div className="w-9 h-9 rounded-full overflow-hidden ring-4 ring-gray-100">
              <img
                src="/assets/images/faces/22.png"
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
          </MenuHandler>
          {datalocal?.data?.is_need_shift && GetQueryParam(0) !== "choose-property" && (
            <div
              className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-3 border-white shadow-md ${
                datalocal?.data?.is_shift ? "bg-green" : "bg-gray-400"
              }`}
            />
          )}
        </div>
      </div>

      <MenuList
          style={{ outline: "focus:outline-none" }}
          placeholder={""}
          className="hover:border-0 !border-white min-w-[220px] shadow-lg"
        >
          <MenuItem className="md:hidden cursor-default flex flex-col items-start gap-1 border-b pb-2 mb-1" placeholder={""}>
            <div className="font-semibold text-gray-900 uppercase tracking-wider">
              {datajsonp?.data?.name ?? ""}
            </div>
            {datalocal?.data?.is_need_shift && GetQueryParam(0) !== "choose-property" && (
              <button
                onClick={() => {
                  if (datalocal?.data?.is_shift) {
                    window.location.assign("/endshift?parent=");
                  } else {
                    StartShift();
                  }
                }}
                className={`flex items-center gap-3 px-5 py-0.5 font-semibold rounded-lg transition-all ${
                  datalocal?.data?.is_shift
                    ? "bg-green text-white hover:bg-green-700"
                    : "bg-gray-600 text-gray-200 hover:bg-gray-300"
                }`}
              >
                {datalocal?.data?.is_shift ? "END SHIFT" : "START SHIFT"}
              </button>
            )}
          </MenuItem>

          {showPropertyMenus && (
            <MenuItem className="cursor-default hover:border-white" placeholder={""}>
              Business Date: {date}
            </MenuItem>
          )}

          {datajsonp?.data?.email ? (
            <MenuItem className="cursor-default hover:border-white" placeholder={""}>
              {datajsonp.data.email}
            </MenuItem>
          ) : (
            <MenuItem className="cursor-default hover:border-white" placeholder={""}>
              &nbsp;
            </MenuItem>
          )}

          {showPropertyMenus && (
            <MenuItem
              style={{ outline: "outline-none" }}
              placeholder={""}
              onClick={() => RouteChange(navigate, "/choose-property", false)}
              className="!pb-1 !pt-1"
            >
              <i className="ri-building-4-fill"></i> Switch Property
            </MenuItem>
          )}

          {showPropertyMenus && (
            <MenuItem
              placeholder={""}
              onClick={handleOpenTask}
              className="!pb-1 !pt-1 hover:bg-indigo-50 transition-colors"
            >
              <i className="ri-task-line mr-1 text-indigo-600"></i>
              <span className="text-indigo-800">Task Message Details</span>
            </MenuItem>
          )}

          <MenuItem
            style={{ outline: "outline-none" }}
            placeholder={""}
            onClick={openChangePass}
            className="!pb-1 !pt-1"
          >
            <i className="ri-key-fill"></i> Change Password
          </MenuItem>

          <MenuItem
            placeholder={""}
            className="!pb-1 !pt-1 hover:bg-blue-50 flex items-center gap-2"
          >
            <a
              href="{env.suriApi}/download/anyaman-hms.apk"
              download="anyaman-hms.apk"
              target="_blank"
              className="flex items-center gap-2 w-full"
            >
              <i className="ri-android-line text-green-600"></i>
              Download Android App
            </a>
          </MenuItem>

          <MenuItem
            style={{ outline: "outline-none" }}
            placeholder={""}
            onClick={CallLogout}
            className="!pb-1 !pt-1"
          >
            <i className="ri-logout-box-fill"></i> Logout
          </MenuItem>
          
        </MenuList>
      </Menu>
      <Dialog placeholder={""} open={open} handler={handleOpen} size="md">
        <DialogHeader placeholder={""}>Change Password</DialogHeader>
          <DialogBody placeholder={""}>
            <div className="grid grid-cols-12 gap-y-4">
              <div className="xl:col-span-12 col-span-12 mb-2">
                <label
                  htmlFor="signin-password"
                  className="form-label text-default block"
                >
                  Current Password
                </label>
                <div className="input-group">
                  <input
                    name="password3"
                    type={passwordshow3 ? "text" : "password"}
                    value={password3}
                    onChange={changeHandler}
                    className="form-control form-control-lg !rounded-s-md"
                    id="signin-password"
                    placeholder="Current Password"
                  />
                  <button
                    onClick={() => setpasswordshow3(!passwordshow3)}
                    aria-label="button"
                    className="ti-btn ti-btn-light !rounded-s-none !mb-0"
                    type="button"
                    id="button-addon2"
                  >
                    <i
                      className={`${
                        passwordshow3 ? "ri-eye-line" : "ri-eye-off-line"
                      } align-middle`}
                    ></i>
                  </button>
                </div>
              </div>
              <div className="xl:col-span-12 col-span-12 mb-2">
                <label
                  htmlFor="signin-password"
                  className="form-label text-default block"
                >
                  New Password
                </label>
                <div className="input-group">
                  <input
                    name="password2"
                    type={passwordshow2 ? "text" : "password"}
                    value={password2}
                    onChange={(e) => {
                      changeHandler(e);
                    }}
                    onKeyUp={() => {
                      validatePassword();
                    }}
                    className="form-control form-control-lg !rounded-s-md"
                    id="signin-password"
                    placeholder="New Password"
                  />
                  <button
                    onClick={() => setpasswordshow2(!passwordshow2)}
                    aria-label="button"
                    className="ti-btn ti-btn-light !rounded-s-none !mb-0"
                    type="button"
                    id="button-addon2"
                  >
                    <i
                      className={`${
                        passwordshow2 ? "ri-eye-line" : "ri-eye-off-line"
                      } align-middle`}
                    ></i>
                  </button>
                </div>
                <p className="text-xs text-danger">{errnewpass}</p>
              </div>
              <div className="xl:col-span-12 col-span-12 mb-2">
                <label
                  htmlFor="signin-password"
                  className="form-label text-default block"
                >
                  Re Password
                  {/* <Link href="#!" className="float-right text-danger">
                            Forget password ?
                          </Link> */}
                </label>
                <div className="input-group">
                  <input
                    name="password"
                    type={passwordshow1 ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      changeHandler(e);
                    }}
                    onKeyUp={() => {
                      confirmPassword();
                    }}
                    className="form-control form-control-lg !rounded-s-md"
                    id="signin-password"
                    placeholder="Re Password"
                  />
                  <button
                    onClick={() => setpasswordshow1(!passwordshow1)}
                    aria-label="button"
                    className="ti-btn ti-btn-light !rounded-s-none !mb-0"
                    type="button"
                    id="button-addon2"
                  >
                    <i
                      className={`${
                        passwordshow1 ? "ri-eye-line" : "ri-eye-off-line"
                      } align-middle`}
                    ></i>
                  </button>
                </div>
                <p className="text-xs text-danger">{errconfirmpass}</p>
              </div>
              <div className="flex xl:col-span-12 gap-4 col-span-12 col mt-2">
                <div className="col-span-12 md:col-span-6">
                  <ButtonSubmit
                    onCreate={() => {
                      handleOpen();
                      // setloading(true);
                    }}
                    loading={false}
                    label="Cancel"
                    alert={false}
                    isprimary={false}
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <ButtonSubmit
                    onCreate={() => {
                      onChangePass();
                      setloading(true);
                    }}
                    loading={loading}
                    label="Submit"
                    alert={false}
                  />
                </div>
              </div>
            </div>
          </DialogBody>
      </Dialog>
      
      <Dialog
        open={openTask}
        handler={handleOpenTask}
        size="xl"
        dismiss={{ enabled: false }}
        // className="z-[1200] max-h-[95vh] w-[95vw] md:w-auto flex flex-col mx-2 md:mx-auto"
        className="z-[1200] w-[95vw] md:w-auto flex flex-col mx-2 md:mx-auto"
        style={{ maxHeight: '90vh', margin: 'auto' }}
        placeholder=""
      >
        <DialogHeader placeholder="" className="text-md shrink-0">
          Task Message Details
        </DialogHeader>

        <DialogBody placeholder="" className="p-0 overflow-y-auto flex-1">
          <div className="flex flex-col md:grid md:grid-cols-12">
            <div className="w-full md:col-span-7 px-4 md:px-6 py-4">
              <Tabs value={activeTab}>
                  <TabsHeader placeholder="">
                    <Tab placeholder="" value="create" onClick={() => setActiveTab("create")}
                      className="text-xs md:text-sm px-2">
                      <span className="hidden sm:inline">Create Task Messages</span>
                      <span className="sm:hidden">Create</span>
                    </Tab>
                    <Tab placeholder="" value="manage" onClick={() => setActiveTab("manage")}
                      className="text-xs md:text-sm px-2">
                      <span className="hidden sm:inline">Task Messages Listing</span>
                      <span className="sm:hidden">Listing</span>
                    </Tab>
                  </TabsHeader>

                  <TabsBody placeholder="" className="flex-1 overflow-y-auto min-h-0">
                    <TabPanel value="create">
                      <div className="grid grid-cols-12 gap-5">

                        <div className="col-span-12 md:col-span-6">
                          <InputMain
                            error={false}
                            typeInput="base"
                            label="Created On"
                            required={true}
                            rest={{
                              name: "createdOn",
                              type: "date",
                              value: taskData.createdOn,
                              onChange: taskChangeHandler,
                            }}
                          />
                        </div>

                        <div className="col-span-12 md:col-span-6">
                          <InputMain
                            error={false}
                            typeInput="base"
                            label="Room"
                            required={false}
                            rest={{
                              name: "room",
                              placeholder: "Enter room number (optional)",
                              value: taskData.room,
                              type: "text",
                              onChange: taskChangeHandler,
                            }}
                          />
                        </div>

                        <div className="col-span-12 md:col-span-6">
                          <Select
                            placeholder=""
                            label="Type"
                            value={taskData.type}
                            onChange={(val) => setTaskData({ ...taskData, type: val })}
                          >
                            <Option value="Task">Task</Option>
                            <Option value="Messages">Messages</Option>
                          </Select>
                        </div>

                        <div className="col-span-12 md:col-span-6">
                          {taskData.type !== "Messages" ? (
                            <Select
                              placeholder=""
                              label="Status"
                              value={taskData.status}
                              onChange={(val) => setTaskData({ ...taskData, status: val })}
                              disabled={taskData.type === "Messages"}
                            >
                              <Option value="Open">Open</Option>
                              <Option value="In Progress">In Progress</Option>
                              <Option value="Closed">Closed</Option>
                            </Select>
                          ) : (
                            <div className="">
                              
                            </div>
                          )}
                        </div>

                        <div className="col-span-12 md:col-span-6">
                          <InputMain
                            error={false}
                            typeInput="base"
                            label="From"
                            required={true}
                            rest={{
                              name: "from",
                              value: datajsonp?.data?.name || datajsonp?.data?.username || "Current User",
                              type: "text",
                              disabled: true,
                              readOnly: true,
                              className: "bg-gray-100 cursor-not-allowed",
                            }}
                          />
                        </div>

                        <div className="col-span-12 md:col-span-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assign To
                          </label>
                          <div className="flex gap-4 mb-3">
                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name="assignType"
                                value="user"
                                checked={taskData.assignType === "user"}
                                onChange={() =>
                                  setTaskData({
                                    ...taskData,
                                    assignType: "user",
                                    to_role_id: "",
                                  })
                                }
                                className="form-radio"
                              />
                              <span className="ml-2">User</span>
                            </label>

                            <label className="inline-flex items-center">
                              <input
                                type="radio"
                                name="assignType"
                                value="role"
                                checked={taskData.assignType === "role"}
                                onChange={() =>
                                  setTaskData({
                                    ...taskData,
                                    assignType: "role",
                                    to_user_id: "",
                                  })
                                }
                                className="form-radio"
                              />
                              <span className="ml-2">Role</span>
                            </label>
                          </div>
                        </div>

                        {taskData.assignType === "user" && (
                          <div className="col-span-12">
                            <Select
                              label="Assign to User"
                              value={taskData.to_user_id}
                              onChange={(val) => setTaskData({ ...taskData, to_user_id: val })}
                              placeholder=""
                              menuProps={{
                                className: "z-50 max-h-60 overflow-y-auto",
                                placement: "bottom-start",
                              }}
                              animate={{
                                mount: { y: 0 },
                                unmount: { y: 25 },
                              }}
                            >
                              {taskOptions.users.map((u) => (
                                <Option key={u.value} value={u.value}>
                                  {u.label}
                                </Option>
                              ))}
                            </Select>
                          </div>
                        )}

                        {taskData.assignType === "role" && (
                          <div className="col-span-12">
                            <Select
                              placeholder=""
                              label="Assign to Role"
                              value={taskData.to_role_id}
                              onChange={(val) => setTaskData({ ...taskData, to_role_id: val })}
                              menuProps={{
                                className: "z-50 max-h-60 overflow-y-auto",
                                placement: "bottom-start",
                              }}
                              animate={{
                                mount: { y: 0 },
                                unmount: { y: 25 },
                              }}
                            >
                              {taskOptions.roles.map((r) => (
                                <Option key={r.value} value={r.value}>
                                  {r.label}
                                </Option>
                              ))}
                            </Select>
                          </div>
                        )}

                        <div className="col-span-12">
                          <Textarea
                            label="Message / Description"
                            name="message"
                            value={taskData.message}
                            onChange={taskChangeHandler}
                            rows={3}
                          />
                        </div>
                      </div>
                    </TabPanel>

                    <TabPanel value="manage" className="pt-4">
                      <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3">
                        {loadingTasks ? (
                          <p className="text-center py-8 text-gray-500">Loading tasks...</p>
                        ) : tasks.length === 0 ? (
                          <p className="text-center py-8 text-gray-400">No tasks yet</p>
                        ) : (
                          tasks.map((task: any) => {
                            const isMe = task.from?.toLowerCase() === currentUserName.toLowerCase() || 
                                        task.isMe === true;

                            return (
                              <div key={task.id} className="border rounded-xl p-4 hover:shadow-md transition-all bg-white">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-indigo-700">{task.type || 'Task'}</span>
                                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{task.status}</span>
                                    </div>
                                    <p className="mt-1 text-gray-800 font-medium">{task.message}</p>
                                  </div>
                                  <div className="text-right text-xs text-gray-500">
                                    {task.created_at}
                                    {task.room_number && task.room_number !== '-' && (
                                      <div>Room {task.room_number}</div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                  {!task.is_read && !isMe && (
                                    <button
                                      onClick={() => markAsRead(task.id)}
                                      className="text-xs px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100"
                                    >
                                      Mark as Read
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleOpenReply(task)}
                                    className="text-xs px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </TabPanel>
                  </TabsBody>
                </Tabs>
            </div>
            <div className={`w-full md:col-span-5 bg-gray-50 px-4 md:px-6 py-4 ${selectedTask ? 'block' : 'hidden md:block'}`}>
              {selectedTask ? (
                <>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="md:hidden flex items-center gap-1 text-sm text-gray-500 mb-3"
                  >
                    Back to list
                  </button>
                  <h3 className="text-lg font-semibold mb-4">
                    Reply to {selectedTask.from || selectedTask.creator_name || 'Unknown User'} :
                  </h3>

                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border">
                    <p className="text-sm font-medium">{selectedTask.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {selectedTask.type || 'Messages'} • {selectedTask.created_at || '—'}
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    {repliesLoading ? (
                      <p>Loading replies...</p>
                    ) : replies.length > 0 ? (
                      replies.map((r) => (
                        <div 
                          key={r.id} 
                          className={`p-3 rounded-lg border bg-deep-orange-100 ${
                            r.isMe ? 'bg-green-50 ml-auto max-w-[80%]' : 'bg-white'
                          }`}
                        >
                          <p className="text-sm">{r.message}</p>
                          <p className="text-xs mt-1 text-gray-700">
                            {r.isMe ? 'You' : r.from} • {r.created_at}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center">No replies</p>
                    )}
                  </div>

                  <Textarea
                    label="Reply Message"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={4}
                  />

                  <div className="flex justify-end gap-3 mt-4">
                    <ButtonSubmit onCreate={() => setSelectedTask(null)} label="Close Chat" isprimary={false} />
                    <ButtonSubmit onCreate={sendReply} label="Sent" loading={sendingReply} />
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-400 text-center mt-20">Chat</p>
              )}
          </div>
        </div>
      </DialogBody>
      <DialogFooter
        placeholder=""
        className="shrink-0 flex flex-row justify-end gap-2 border-t bg-white px-4 py-3 rounded-b-lg"
      >
        <ButtonSubmit
          onCreate={handleOpenTask}
          loading={false}
          label="Close"
          isprimary={false}
        />
        {activeTab === "create" && (
          <ButtonSubmit
            onCreate={onCreateTask}
            loading={loading}
            label="Create Task"
          />
        )}
      </DialogFooter>
      </Dialog>
    </>
  );
};

export default Profile;
