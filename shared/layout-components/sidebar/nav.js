import React from "react";

const DashboardIcon = <i className="bx bx-home side-menu__icon"></i>

const ErrorIcon = <i className="bx bx-error side-menu__icon"></i>

const NestedmenuIcon = <i className="bx bx-layer side-menu__icon"></i>

const badge = <span className="badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2">12</span>

export const MenuItems = [
    {menutitle: "MAIN", Items: [

            {icon: DashboardIcon, badgetxt: badge, title: 'Dashboards', type: "sub", active: false, children: [
                    {path: "/components/dashboards/crm", type: "link", active: false, selected: false, title: "CRM" },

                ]
            },
        ]
    },
    {
        menutitle: "PAGES", Items: [
            { icon: ErrorIcon, title: "Error", type: "sub", active: false, selected: false, children: [

                    {path: "/components/error/error-401", type: "link", active: false, selected: false, title: "401-Error" },
                ]
            },

        ]
    },
    {
        menutitle: "Web app", Items: [
            {
				icon: NestedmenuIcon, title: "Nested Menu", type: "sub", active: false, selected: false, children: [

					{ title: "Nested-1", path: "", type: "link", active: false, selected: false },

					{
						title: "Nested-2", type: "sub", active: false, selected: false, children: [

							{ type: "link", path: "", active: false, selected: false, title: "Nested-2-1" },
							{ type: "link", path: "", active: false, selected: false, title: "Nested-2-2" },
							{ type: "link", path: "", active: false, selected: false, title: "Nested-2-3" },
					
				]
			},
				]
			},
        ]
    },

];
export default MenuItems
