declare module 'vue' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    SchemaForm: (typeof import('@formvk/element-plus'))['SchemaForm']
    CrudTable: (typeof import('@formvk/element-plus'))['CrudTable']
    DataTable: (typeof import('@formvk/element-plus'))['DataTable']
    SearchForm: (typeof import('@formvk/element-plus'))['SearchForm']
    AddPopup: (typeof import('@formvk/element-plus'))['AddPopup']
    EditPopup: (typeof import('@formvk/element-plus'))['EditPopup']
    PopupForm: (typeof import('@formvk/element-plus'))['PopupForm']
    ModalForm: (typeof import('@formvk/element-plus'))['ModalForm']
    DrawerForm: (typeof import('@formvk/element-plus'))['DrawerForm']
  }
}

export {}
