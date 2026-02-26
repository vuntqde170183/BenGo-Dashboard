# Quy định Thiết kế & Phát triển UI

Tài liệu này tóm tắt các quy chuẩn về giao diện (UI) và cách viết code CSS/Component để đảm bảo tính đồng nhất cho dự án Company Management.
## 1. Header của Dialog (DialogHeader)
Tất cả các thành phần `DialogHeader` phải được thiết kế theo cấu trúc sau, DialogContent thì chỉ sử dụng size "medium" hoặc
"small" thôi, đừng sử dụng className và đừng sử dụng size "large":
```tsx
<DialogContent size="medium">
    <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-primary">
            <Icon path={isEdit ? mdiTools : mdiPackageVariantClosedPlus} size={0.8} />
            <span>{isEdit ? "Cập nhật dụng cụ" : "Thêm dụng cụ mới"}</span>
        </DialogTitle>
    </DialogHeader>
</DialogContent>
```

## 2. Header của Card (CardHeader)
Các `CardHeader` cần có đường kẻ viền dưới và sử dụng màu text/icon là `primary`:
```tsx
<CardHeader className="border-b border-b-darkBorderV1 py-3">
    <div className="flex items-center gap-2">
        <Truck className="h-5 w-5 text-primary" />
        <span className="font-semibold text-primary">
            Thông tin tài xế & Xe
        </span>
    </div>
</CardHeader>
```

## 3. Đường phân cách tiêu đề (Dashed Line Divider)
Đối với các tiêu đề mục nhỏ bên trong trang hoặc dialog, sử dụng đường kẻ đứt (`dashed line`) để phân tách, phải chuẩn như styling, format dưới đây, không được tùy chỉnh bậy bạ:
```tsx
<div className="flex items-center gap-3 md:gap-4">
    <h3 className="text-primary font-semibold whitespace-nowrap">Thông tin cơ bản</h3>
    <div className="flex-1 border-b border-dashed border-primary mr-1" />
</div>
```

## 4. Trạng thái trống (Empty States)
Khi không có dữ liệu để hiển thị, sử dụng kiểu dáng placeholder sau:
```tsx
// Styling classname cho div chuẩn như thế này, không được khác
<div className="text-center text-neutral-400 text-sm py-2 italic flex items-center justify-center gap-1">
    <Icon path={mdiCalendarRemoveOutline} size={0.8} /> // Thay thế icon tương ứng
    Chưa có lịch // thay thế text tương ứng
</div>
```

## 5. Tiêu đề Bảng (Table Headers)
Tiêu đề bảng cần gọn gàng, không sử dụng className cho TableRow (của Header) và TableHead, không lạm dụng định nghĩa chiều rộng (width) trừ khi thực sự cần thiết, cứ clean như mẫu dưới đây là được vì trong components/ui/table.tsx đã có định nghĩa sẵn. Thường sẽ được căn lề trái, ngoại trừ các cột đặc trưng như "STT":
```tsx
<TableHeader>
    <TableRow>
        <TableHead>STT</TableHead>
        <TableHead>Mã nhân viên</TableHead>
        <TableHead>Họ và Tên</TableHead>
        <TableHead>Ngày sinh</TableHead>
        <TableHead>Quê quán</TableHead>
        <TableHead>Số điện thoại</TableHead>
        <TableHead>Phòng ban</TableHead>
        <TableHead>Chức vụ</TableHead>
        <TableHead>Trạng thái</TableHead>
        <TableHead>Thao tác</TableHead>
    </TableRow>
</TableHeader>
```

## 6. Huy hiệu (Badges)
Các component Badge không được sử dụng `className` để tùy chỉnh styling (màu sắc, kích thước, padding, v.v.). Chỉ sử dụng các `variant` đã được định nghĩa sẵn trong `components/ui/badge.tsx` để đảm bảo tính nhất quán:
```tsx
<Badge variant="green">Hoạt động</Badge>
<Badge variant="orange">Chờ xử lý</Badge>
<Badge variant="red">Quá hạn</Badge>
```

## 7. Footer của Dialog (DialogFooter)
Tương tự như Header, `DialogFooter` không cần sử dụng `className`. Chỉ cần clean như mẫu dưới đây:
```tsx
<DialogFooter>
    <Button variant="outline" onClick={onClose}>
        Hủy
    </Button>
    <Button onClick={handleSubmit}>
        Xác nhận
    </Button>
</DialogFooter>
```

## 8. Nhãn (Label)
Thành phần `Label` không cần thêm `className` tùy chỉnh (như màu sắc, độ đậm, v.v.) vì đã có định nghĩa mặc định đồng nhất:
```tsx
<Label htmlFor="equipmentName">Tên dụng cụ</Label>
```

## 9. Nút bấm (Buttons)
Các nút bấm cần tuân thủ các quy tắc sau để đảm bảo tính thẩm mỹ và nhất quán:
- Luôn phải có **Icon MDI** đi kèm với `size={0.8}`.
- **Không tùy chỉnh styling**: Tuyệt đối không set cứng màu sắc, chiều cao (`h-`), hoặc chiều rộng (`w-`). Chỉ cho phép sử dụng các class layout như `w-full` hoặc `flex-1`.
- **Kích thước (Size)**: Không sử dụng `size="sm"`. Chỉ sử dụng kích thước mặc định hoặc `size="icon"` cho các nút dạng vuông (square icon button).
- **Thao tác trong bảng**: Các nút trong cột "Thao tác" của bảng phải sử dụng `size="icon"` và bắt buộc phải có `Tooltip` bao quanh để giải thích chức năng.

```tsx
// Nút bình thường
<Button onClick={handleSave}>
    <Icon path={mdiContentSave} size={0.8} />
    Lưu dữ liệu
</Button>

// Nút thao tác trong bảng
<Tooltip>
    <TooltipTrigger asChild>
        <Button size="icon" variant="ghost" onClick={handleEdit}>
            <Icon path={mdiPencil} size={0.8} />
        </Button>
    </TooltipTrigger>
    <TooltipContent>Chỉnh sửa</TooltipContent>
</Tooltip>
```

## 10. Kích thước chữ (Font Size)
Cấm tuyệt đối việc sử dụng `text-xs`, `text-[11px]`, nhỏ nhất phải là `text-xs`.

## 11. Kích thước Icon (Icon Size)
Tuyệt đối **CHỈ SỬ DỤNG** 2 kích thước icon sau cho toàn bộ dự án:
- `size={0.8}`: Kích thước tiêu chuẩn cho các nút bấm, tiêu đề, và thông tin chính.
- `size={0.6}`: Kích thước nhỏ khi cần hiển thị icon trong không gian hẹp (phụ đề, danh sách con).
- **Cấm tuyệt đối** việc sử dụng các size khác (0.7, 0.75, 0.9, v.v.).

## 11. Cấu trúc Dialog chuẩn (Standard Dialog Structure)
Các dialog phải có cấu trúc chuẩn như sau, không được khác styling, format, không thêm các className tầm bậy làm khác Format dưới đây (chỉ được phép thay đổi **Icon**, **text** bên trong `DialogTitle` và các **nút bấm chức năng** trong `DialogFooter` cho phù hợp với nghiệp vụ):
```tsx
<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <DialogContent size="medium">
        <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-primary">
                <Icon path={mdiClipboardCheckOutline} size={0.8} />
                <span>Thực hiện kiểm kê thiết bị</span>
            </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 md:space-y-4 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar p-3 md:p-4">
           // Content in Dialog here
        </div>

        <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isPending}>
                <Icon path={mdiClose} size={0.8} />
                Hủy bỏ
            </Button>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={() => prepareSubmit('draft')}
                    disabled={isPending || items.length === 0}
                >
                    <Icon path={mdiContentSave} size={0.8} />
                    Lưu bản nháp
                </Button>
                <Button
                    onClick={() => prepareSubmit('completed')}
                    disabled={isPending || items.length === 0}
                >
                    <Icon path={mdiCheckCircleOutline} size={0.8} />
                    {isPending ? "Đang xử lý..." : "Hoàn thành kiểm kê"}
                </Button>
            </div>
        </DialogFooter>
    </DialogContent>
</Dialog>
```

## 12. Bảng được bọc trong Card (Tables in Cards)
Khi sử dụng `Card` để bọc các thành phần `Table` bên trong (thường dùng trong Dialog hoặc các Section nhỏ), bắt buộc phải sử dụng bộ `className` chuẩn sau để đảm bảo spacing và hiển thị đồng nhất:
```tsx
<Card className="p-0 overflow-hidden border border-darkBorderV1 bg-transparent">
    <Table>
        ...
    </Table>
</Card>
```

## 13. UI dành cho không có, chưa có:
```tsx
<div className="text-center text-neutral-400 text-sm py-20 italic flex flex-col items-center justify-center gap-3">
    <Icon path={mdiSelectionMarker} size={1.2} className="text-neutral-400" />
    <p>Vui lòng chọn một đơn hàng để tìm tài xế lân cận</p>
</div>
```
