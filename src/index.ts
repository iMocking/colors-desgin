import type {App} from 'vue'
import {
    Form,
    Input,
    Button,
    Pagination,
    FormItem,
    Table,
    Menu,
    MenuItem,
    Modal,
    SubMenu,
    Drawer,
    Breadcrumb,
    BreadcrumbItem,
    Notification,
    Loading,
    AvatarUpload,
    Carousel,
    CarouselItem,
    NoticeBar,
} from "./components";

// 导出单个组件
export {
    Button,
    Input,
    Form,
    FormItem,
    Pagination,
    Table,
    Menu,
    MenuItem,
    Modal,
    SubMenu,
    Drawer,
    Breadcrumb,
    BreadcrumbItem,
    Notification,
    Loading,
    AvatarUpload,
    Carousel,
    CarouselItem,
    NoticeBar
}

import type {
    BreadcrumbItemProps,
    BreadcrumbProps,
    ButtonProps,
    DrawerProps,
    InputProps,
    FormProps,
    PaginationProps,
    ModalProps,
    MenuProps,
    MenuItemProps,
    TableProps,
    NotificationProps,
    SubMenuProps,
    FormItemProps,
    TableColumn,
    CarouselProps,
    CarouselItemProps,
    NoticeBarProps,
    LoadingProps,
    AvatarUploadProps,
} from "./components"

export type {
    ButtonProps,
    InputProps,
    FormProps,
    DrawerProps,
    PaginationProps,
    ModalProps,
    BreadcrumbProps,
    BreadcrumbItemProps,
    MenuProps,
    MenuItemProps,
    TableProps,
    NotificationProps,
    SubMenuProps,
    FormItemProps,
    TableColumn,
    CarouselProps,
    CarouselItemProps,
    NoticeBarProps,
    LoadingProps,
    AvatarUploadProps,
}
// 导出服务
export {NotificationManager, LoadingService} from './components'
// 统一导出所有组件
export * from './components/index'

// 统一导出样式
import './styles/index.css'

// 定义 install 方法，接收 Vue 作为参数
const install = (app: App): void => {
    app.component(Button.name || 'ImButton', Button)
        .component(Input.name || 'ImInput', Input)
        .component(Form.name || 'ImForm', Form)
        .component(FormItem.name || 'ImFormItem', FormItem)
        .component(Pagination.name || 'ImPagination', Pagination)
        .component(Table.name || 'ImTable', Table)
        .component(Menu.name || 'ImMenu', Menu)
        .component(MenuItem.name || 'ImMenuItem', MenuItem)
        .component(Modal.name || 'ImModal', Modal)
        .component(SubMenu.name || 'ImSubMenu', SubMenu)
        .component(Drawer.name || 'ImDrawer', Drawer)
        .component(Breadcrumb.name || 'ImBreadcrumb', Breadcrumb)
        .component(BreadcrumbItem.name || 'ImBreadcrumbItem', BreadcrumbItem)
        .component(Notification.name || 'ImNotification', Notification)
        .component(Loading.name || 'ImLoading', Loading)
        .component(AvatarUpload.name || 'ImAvatarUpload', AvatarUpload)
        .component(Carousel.name || 'ImCarousel', Carousel)
        .component(CarouselItem.name || 'ImCarouselItem', CarouselItem)
        .component(NoticeBar.name || 'ImNoticeBar', NoticeBar)
    ;
    // 将服务添加到全局属性中
    // app.config.globalProperties.$notify = NotificationManager as Function
    // app.config.globalProperties.$loading = LoadingService as Function
}

// 创建一个伪模块，使其具有 install 方法
export default {
    install,
    // ...components
}

// 确保导出 Vue 的 Plugin 类型
export type {Plugin} from 'vue'
