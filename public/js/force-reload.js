/*
    Force reload script - clears cache and reloads
    Add this to dashboard to force fresh load
*/

(function() {
    // Check if we need to force reload
    const forceReloadKey = 'inventory_force_reload_v2';
    const hasReloaded = sessionStorage.getItem(forceReloadKey);
    
    if (!hasReloaded) {
        console.log('🔄 Force reloading to clear cache...');
        sessionStorage.setItem(forceReloadKey, 'true');
        
        // Clear cache and reload
        if ('caches' in window) {
            caches.keys().then(function(names) {
                for (let name of names) {
                    caches.delete(name);
                }
            });
        }
        
        // Force reload from server
        window.location.reload(true);
    } else {
        console.log('✅ Cache cleared, page reloaded');
    }
})();
