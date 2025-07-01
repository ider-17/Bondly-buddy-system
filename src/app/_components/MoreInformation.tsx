export default function MoreInformation() {
    return (
        <div className="py-5 px-6 rounded-xl bg-white border border-gray-200 space-y-6">
            <h6 className="text-lg font-semibold">Дэлгэрэнгүй мэдээлэл</h6>

            <hr />

            <div className="space-y-3">
                <div className="py-2 px-6 border border-gray-200 rounded-lg">
                    <p className="text-neutral-600 font-medium">Mail</p>
                    <p className="font-medium">Togtuun@apple.com</p>
                </div>

                <div className="py-2 px-6 border border-gray-200 rounded-lg">
                    <p className="text-neutral-600 font-medium">Phone number</p>
                    <p className="font-medium">+976 99101234</p>
                </div>

                <div className="py-2 px-6 border border-gray-200 rounded-lg">
                    <p className="text-neutral-600 font-medium">Started</p>
                    <p className="font-medium">2025 • 06 • 12</p>
                </div>
            </div>
        </div>
    )
}