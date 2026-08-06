export default function GalleryPage() {
    const samplePhotos = [
        { id: 1, title: "Main Administration Building", category: "Campus" },
        { id: 2, title: "Science Laboratory Session", category: "Academics" },
        { id: 3, title: "Geography Club Field Trip", category: "Clubs" },
        { id: 4, title: "Annual Sports Day Competition", category: "Sports" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-extrabold text-blue-900 mb-2">School Gallery</h1>
            <p className="text-slate-600 mb-8">Highlights of academic activities, sports events, and co-curricular projects at St. Mary's SS Manja.</p>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                {samplePhotos.map((photo) => (
                    <div key={photo.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                        <div className="h-48 bg-slate-200 flex items-center justify-center text-slate-400 font-semibold">
                            Photo Placeholder
                        </div>
                        <div className="p-4">
                            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                                {photo.category}
                            </span>
                            <h3 className="font-semibold text-slate-800 mt-2 text-sm">{photo.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}