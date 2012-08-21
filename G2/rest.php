<?php
// +---------------------------------------------------------------------------+
// | rest.php     [v.3.1.2]                                                    |
// +---------------------------------------------------------------------------+
// | Copyright (C) 2012 Wayne Patterson [suprsidr@flashyourweb.com]            |
// +---------------------------------------------------------------------------+
// |                                                                           |
// | This program is free software; you can redistribute it and/or             |
// | modify it under the terms of the GNU General Public License               |
// | as published by the Free Software Foundation; either version 2            |
// | of the License, or (at your option) any later version.                    |
// |                                                                           |
// | This program is distributed in the hope that it will be useful,           |
// | but WITHOUT ANY WARRANTY; without even the implied warranty of            |
// | MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the             |
// | GNU General Public License for more details.                              |
// |                                                                           |
// | You should have received a copy of the GNU General Public License         |
// | along with this program; if not, write to the Free Software Foundation,   |
// | Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.           |
// |                                                                           |
// +---------------------------------------------------------------------------+
//

/* Connect to gallery */
function init() {
    require_once ('embed.php');
    $ret = GalleryEmbed::init(array('fullInit'=>true));
    /**
     * If your gallery is embedded and you want links to point to your embed page,
     * comment out line above and edit and uncomment line below - full urls are ok
     * @see http://gallery.menalto.com/apidoc/GalleryCore/Classes/GalleryEmbed.html#methodinit
     */
    //$ret = GalleryEmbed::init(array('fullInit'=>true, 'embedUri'=>'/path to your embed/mypage.php', 'g2Uri'=>'/path to your gallery2/'));
    if ($ret) {
        die('GalleryEmbed::init failed, here is the error message: '.$ret->getAsHtml());
    }
    GalleryEmbed::done();
}

/**
 * Dynamic query for tag items
 * @param int $userId
 * @param string $keyword (optional) keyword for query; get from request if not specified
 * @return array object GalleryStatus a status code
 *               array of item ids
 * @static
 */
function getTagChildIds($userId, $tagName = null) {
    global $gallery,$numberOfItems;
    $storage = &$gallery->getStorage();

    if (!isset($tagName)) {
        $tagName = GalleryUtilities::getRequestVariables('tagName');
    }
    if ( empty($tagName)) {
        die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
    }
    GalleryCoreApi::requireOnce('modules/tags/classes/TagsHelper.class');
    /* Force case-sensitive look-up to make the query use an column index */
    list($ret, $tagId) = TagsHelper::getTagIdFromName($tagName, true);
    if ($ret) {
        die($ret);
    }

    if ( empty($tagId)) {
        die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
    }

    list($ret, $query, $data) = GalleryCoreApi::buildItemQuery('TagItemMap', 'itemId', '[TagItemMap::tagId] = ?', null, null, null, 'core.view', false, $userId);
    if ($ret) {
        die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
    }

    list($ret, $searchResults) = $gallery->search($query, array_merge(array($tagId), $data));
    if ($ret) {
        die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
    }
    $itemIds = array();
    while ($result = $searchResults->nextResult()) {
        $itemIds[] = $result[0];
    }
    /* Start item display loop */
    if (! empty($itemIds)) {
        $json = array();
        list($ret, $childItems) = GalleryCoreApi::loadEntitiesById($itemIds, 'GalleryItem');
        if ($ret) {
            die("Error loading childItems:".$ret->getAsHtml());
        }
        $numberOfItems = count($childItems);
        if (isset($_REQUEST['shuffle']) && $_REQUEST['shuffle'] == 1) {
            shuffle($childItems);
        }
        foreach ($childItems as $childItem) {
            // we need to check the disabledFlag for each in dynamic mode
            $disabled = getDisabledFlag($childItem->getId());
            if (!$disabled) {
                if (!($childItem->entityType == "GalleryAlbumItem")) {
                    $json[] = getJsonObject($childItem);
                }
            }
        }
    return $json;
    }/* End item display loop */
}

/**
 * Dynamic query for keyword items
 * @param int $userId
 * @param string $keyword (optional) keyword for query; get from request if not specified
 * @return array GalleryStatus a status code
 *               array of item ids
 * @static
 */
function getKeywordChildIds($userId, $keyword) {
    global $gallery,$numberOfItems;
    $storage = &$gallery->getStorage();

    if (!isset($keyword)) {
        $keyword = GalleryUtilities::getRequestVariables('keyword');
    }
    if ( empty($keyword)) {
        die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
    }

    list($ret, $module) = GalleryCoreApi::loadPlugin('module', 'keyalbum');
    if ($ret) {
        die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
    }
    list($ret, $params) = GalleryCoreApi::fetchAllPluginParameters('module', 'keyalbum');
    if ($ret) {
        die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
    }

    $keywords = $where = array();
    foreach ($module->splitKeywords($keyword, $params['split']) as $k) {
        $keywords[] = '%'.$k.'%';
        $where[] = '[GalleryItem::keywords] LIKE ?';
    }

    list($ret, $query, $data) = GalleryCoreApi::buildItemQuery('GalleryItem', 'id', implode(' AND ', $where), $params['orderBy'], $params['orderDirection'], null, 'core.view', false, $userId);
    if ($ret) {
        die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
    }
    if ( empty($query)) {
        die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
    }

    list($ret, $searchResults) = $gallery->search($query, array_merge($keywords, $data));
    if ($ret) {
        die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
    }
    $itemIds = array();
    while ($result = $searchResults->nextResult()) {
        $itemIds[] = $result[0];
    }
    /* Start item display loop */
    if (! empty($itemIds)) {
        $json = array();
        list($ret, $childItems) = GalleryCoreApi::loadEntitiesById($itemIds, 'GalleryItem');
        if ($ret) {
            die("Error loading childItems:".$ret->getAsHtml());
        }
        $numberOfItems = count($childItems);
        if (isset($_REQUEST['shuffle']) && $_REQUEST['shuffle'] == 1) {
            shuffle($childItems);
        }
        foreach ($childItems as $childItem) {
            /* We need to check the disabledFlag for each in dynamic mode */
            $disabled = getDisabledFlag($childItem->getId());
            if (!$disabled) {
                if (!($childItem->entityType == "GalleryAlbumItem")) {
                    $json[] = getJsonObject($childItem);
                }
            }
        }
        return $json;
    }/* End item display loop */
}

/**
 * Dynamic query for dynamic items
 * @param int $userId
 * @return array object GalleryStatus a status code
 *               array of item ids
 * @static
 */
function getDynamicChildIds($userId, $param = 'date', $orderBy = 'creationTimestamp', $orderDirection = ORDER_DESCENDING , $table = 'GalleryEntity', $id = 'id') {
    global $gallery,$numberOfItems,$g2_itemId;
    $storage = &$gallery->getStorage();
    list($ret, $params) = GalleryCoreApi::fetchAllPluginParameters('module', 'dynamicalbum');
    if ($ret) {
        die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
    }
    $size = $params['size.'.$param];
    $type = $params['type.'.$param];
    if (!$size) {
        die(GalleryCoreApi::error(ERROR_PERMISSION_DENIED));
    }

    list($show, $albumId) = GalleryUtilities::getRequestVariables('show', 'albumId');
    if ( empty($albumId)) {
        $albumId = $g2_itemId;
    }
    if (! empty($show)) {
        $type = $show;
    }
    switch ($type) {
        case 'data':
            $class = 'GalleryDataItem';
            break;
        case 'all':
            $class = 'GalleryItem';
            break;
        case 'album':
            $class = 'GalleryAlbumItem';
            break;
        default:
            die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
    }
    if (!isset($table)) {
        $table = $class;
    }

    $query = '['.$table.'::'.$id.'] IS NOT NULL';
    if (! empty($albumId)) {
        list($ret, $sequence) = GalleryCoreApi::fetchParentSequence($albumId);
        if ($ret) {
            die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
        }
        if (! empty($sequence)) {
            $sequence = implode('/', $sequence).'/'.(int) $albumId.'/%';
            $query = '[GalleryItemAttributesMap::parentSequence] LIKE ?';
            $table = 'GalleryItemAttributesMap';
            $id = 'itemId';
        } else {
            $query = '['.$table.'::'.$id.'] <> '.(int) $albumId;
        }
    }
    if(isset($_REQUEST['last30'])){
        $query = 'UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL 30 day)) <= [GalleryEntity::creationTimestamp]';
    }
    if ($table == $class) {
        $class = null;
    }
    list($ret, $query, $data) = GalleryCoreApi::buildItemQuery($table, $id, $query, $orderBy, $orderDirection, $class, 'core.view', false, $userId);
    if ($ret) {
        die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
    }
    if(isset($_REQUEST['last30'])){
        //print($query);
    }

    if ( empty($query)) {
        die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
    }
    if (! empty($sequence)) {
        array_unshift($data, $sequence);
    }

    list($ret, $searchResults) = $gallery->search($query, $data, array('limit'=>array('count'=>$size)));
    if ($ret) {
        die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
    }
    $itemIds = array();
    while ($result = $searchResults->nextResult()) {
        $itemIds[] = $result[0];
    }
    /* Start item display loop */
    if (! empty($itemIds)) {
        $json = array();
        list($ret, $childItems) = GalleryCoreApi::loadEntitiesById($itemIds, 'GalleryItem');
        if ($ret) {
            die("Error loading childItems:".$ret->getAsHtml());
        }
        $numberOfItems = count($childItems);
        if (isset($_REQUEST['shuffle']) && $_REQUEST['shuffle'] == 1) {
            shuffle($childItems);
        }
        foreach ($childItems as $childItem) {
            /* We need to check the disabledFlag for each in dynamic mode */
            $disabled = getDisabledFlag($childItem->getId());
            if (!$disabled) {
                if (!($childItem->entityType == "GalleryAlbumItem")) {
                    $json[] = getJsonObject($childItem);
                }
            }
        }
        return $json;
    }/* End item display loop */
}

function getSearchItems($id) {
    global $gallery,$userId,$numberOfItems;
    if (isset($_REQUEST['mime'])) {
        $mime = $_REQUEST['mime'];
    }
    $searchResults = array();
    list($Albums) = getAlbumsRecursive($id);
    foreach ($Albums as $Album) {
        /* We can check for disabledFlag for the whole album */
        if (!(getDisabledFlag($Album->getId()))) {
            list($ret, $childIds) = GalleryCoreApi::fetchChildItemIds($Album, $offset = null, $count = null, $userId);
            if ($ret) {
                die("Error finding child item ids:".$ret->getAsHtml());
            }
            if (! empty($childIds)) {
                list($ret, $childItems) = GalleryCoreApi::loadEntitiesById($childIds, 'GalleryItem');
                if ($ret) {
                    die("Error loading childItems:".$ret->getAsHtml());
                }
                if (isset($mime)) {
                    foreach ($childItems as $childItem) {
                        if (getMime($childItem) == $mime) {
                            $searchResults[] = $childItem;
                        }
                    }
                }
            }
        }
    }
    /* Start item display loop */
    if (! empty($searchResults)) {
        $json = array();
        $numberOfItems = count($searchResults);
        if (isset($_REQUEST['shuffle']) && $_REQUEST['shuffle'] == 1) {
            shuffle($searchResults);
        }
        foreach ($searchResults as $childItem) {
            /* We need to check the disabledFlag for each in dynamic mode */
            $disabled = getDisabledFlag($childItem->getId());
            if (!$disabled) {
                if (!($childItem->entityType == "GalleryAlbumItem")) {
                    $json[] = getJsonObject($childItem);
                }
            }
        }
        return $json;
    }/* End item display loop */
}


function getAlbumsRecursive($id) {
    global $gallery;
    /* Get ids of all all albums where we can add new album items */
    list($ret, $tree) = GalleryCoreApi::fetchAlbumTree($id, null, null);
    if ($ret) {
        die("Error fetching album tree ".$ret->getAsHtml());
    }

    /* Load all the album entities */
    list($ret, $albums) = GalleryCoreApi::loadEntitiesById(GalleryUtilities::arrayKeysRecursive($tree), 'GalleryAlbumItem');
    if ($ret) {
        $albums = array();
    }
    /* Load and Add our starting point */
    list($ret, $startAlbum) = GalleryCoreApi::loadEntitiesById($id, 'GalleryAlbumItem');
    if ($ret) {
        die("Error loading start album ".$ret->getAsHtml());
    }
    array_push($albums, $startAlbum);
    if(isset($_REQUEST['sort']) && $_REQUEST['sort'] != ''){
        foreach($albums as $a => $b){
            $c[$a] = $b->$_REQUEST['sort'];
        }
        array_multisort($c, SORT_ASC, $albums);
    }
    return array($albums);
}

function getRoot() {
    global $gallery;
    if (GalleryUtilities::isCompatibleWithApi(array(7, 5), GalleryCoreApi::getApiVersion())) {
        list($ret, $defaultId) = GalleryCoreApi::getDefaultAlbumId();
        if ($ret) {
            die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
        } else {
            return $defaultId;
        }
    } else {
        list($ret, $defaultId) = GalleryCoreApi::getPluginParameter('module', 'core', 'id.rootAlbum');
        if ($ret) {
            die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
        } else {
            return $defaultId;
        }
    }
}

function getItemsRecursive($id) {
    global $gallery;
    $json = array();
    list($albums) = getAlbumsRecursive($id);
    foreach ($albums as $album) {
        $json[] = getItems($album->getId());
    }
    return $json;
}

function getItems($id) {
    global $gallery,$userId,$numberOfItems;
    $display = "";
    list($ret, $entity) = GalleryCoreApi::loadEntitiesById($id, 'GalleryItem');
    if ($ret) {
        die("Error loading Entity:".$ret->getAsHtml());
    }
    /* We can check for disabledFlag for the whole album */
    $disabled = getDisabledFlag($id);
    if (!$disabled) {
        list($ret, $childIds) = GalleryCoreApi::fetchChildItemIds($entity, $offset = null, $count = null, $userId);
        if ($ret) {
            die("Error finding child item ids:".$ret->getAsHtml());
        }
        $json = array();
        list($ret, $childItems) = GalleryCoreApi::loadEntitiesById($childIds, 'GalleryItem');
        if ($ret) {
            die("Error loading childItems:".$ret->getAsHtml());
        }
        if (! empty($childItems)) {
            $numberOfItems = count($childItems);
            if (isset($_REQUEST['shuffle']) && $_REQUEST['shuffle'] == 1) {
                shuffle($childItems);
            }
            foreach ($childItems as $childItem) {
                if (!($childItem->entityType == "GalleryAlbumItem")) {
                    $json[] = getJsonObject($childItem);
                }
            }
        }
        return $json;
    }
}

function getFirstAlbumAncestor($item){
    global $gallery;
    list($ret, $parents) = GalleryCoreApi::fetchParents($item);
    if ($ret) {
        return $item;
    }
    $parents = array_reverse($parents);
    return $parents[0];
}

/* Check if current user has view permissions */
function hasPermission($itemId) {
    global $gallery,$userId;
    if (!$userId) {
        $userId = $gallery->getActiveUserId();
    }
    if (!$userId) {
        list($ret, $userId) = GalleryCoreApi::getAnonymousUserId();
    }
    list($ret, $ok) = GalleryCoreApi::hasItemPermission($itemId, 'core.view', $userId);
    if ($ret || !$ok) {
        return false;
    } else {
        return true;
    }
}

/* Check to see if a module is available */
function pluginCheck($plugin) {
    global $gallery;
    list($ret, $modules) = GalleryCoreApi::fetchPluginStatus('module');
    if ($ret) {
        die("Error checking plugin:".$plugin." - ".$ret->getAsHtml());
    }
    if ($modules[$plugin]['active'] && $modules[$plugin]['available']) {
        return true;
    } else {
        return false;
    }
}

/* Check to see if the "Prevent this album from being displayed in the Image Block" is checked */
function getDisabledFlag($itemId) {
    global $gallery;
    $isActive = pluginCheck('imageblock');
    if ($isActive) {
        list($ret, $searchResults) = GalleryCoreApi::getMapEntry('ImageBlockDisabledMap', array('itemId'), array('itemId'=>(int) $itemId));
        if ($ret) {
            return false;
        }
        $result = false;
        if ($rec = $searchResults->nextResult()) {
            $result = (bool)$rec[0];
        }
        return $result;
    } else {
        //we want to return false if the imageBlock module is not active
        return false;
    }
}

function getResizes($item) {
    global $gallery;
    $itemId = $item->getId();
    list($ret, $resizes) = GalleryCoreApi::fetchResizesByItemIds(array($itemId));
    if ($ret) {
        die("Error loading ResizesByItemIds:".$ret->getAsHtml());
    }
    if (isset($resizes)) {
        foreach ($resizes as $resized) {
            $display .= getView($resized[0]);
        }
    } else {
        $display .= "none";
    }
    return $display;
}

function getPreferred($item) {
    global $gallery;
    $id = $item->getId();
    list($ret, $preferred) = GalleryCoreApi::fetchPreferredsByItemIds(array($id));
    if ($ret) {
        die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
    }
    if (! empty($preferred[$id])) {
        return $preferred[$id];
    } else {
        return $item;
    }
}

function getOwner($id, $type) {
    list($ret, $entity) = GalleryCoreApi::loadEntitiesById($id, $type);
    if ($ret) {
        die("Error loading ownerId:".$ret->getAsHtml());
    }
    $owner = $entity->userName;
    return $owner;
}

function getTitle($item) {
    if(method_exists($item, 'getTitle')){
        return preg_replace("/&amp;/", '&', stripTags($item->getTitle()));
    }else {
        return '';
    }
}

function stripTags($tostrip) {
    GalleryCoreApi::requireOnce('lib/smarty_plugins/modifier.markup.php');
    return smarty_modifier_markup($tostrip, 'strip');
}

function getMime($item) {
    if (method_exists($item, 'getMimeType')) {
        return $item->getMimeType();
    } else {
        return null;
    }
}

function getWidth($item) {
    if (method_exists($item, 'getWidth')) {
        return $item->getWidth();
    } else {
        return null;
    }
}

function getHeight($item) {
    if (method_exists($item, 'getHeight')) {
        return $item->getHeight();
    } else {
        return null;
    }
}

function getRating($item) {
    global $gallery;
    $isActive = pluginCheck('rating');
    if ($isActive) {
        $itemId = $item->getId();
        $rating = '';
        GalleryCoreApi::requireOnce('modules/rating/classes/RatingHelper.class');
        list($ret, $Ratings) = RatingHelper::fetchRatings($itemId, '');
        if (! empty($Ratings)) {
            $rating = $Ratings[$id]['rating'];
            return "            <rating>".$rating."</rating>\n";
        } else {
            return "            <rating>0</rating>\n";
        }
    }
}

function getThumbUrl($item) {
    global $gallery;
    $urlGenerator = &$gallery->getUrlGenerator();
    $itemId = $item->getId();
    list($ret, $thumbnail) = GalleryCoreApi::fetchThumbnailsByItemIds(array($itemId));
    if (!$ret && ! empty($thumbnail)) {
        $thumbUrl = $urlGenerator->generateUrl(array('view'=>'core.DownloadItem', 'itemId'=>$thumbnail[$itemId]->getId(), 'serialNumber'=>$thumbnail[$itemId]->getSerialNumber()), array('forceFullUrl'=>true, 'forceSessionId'=>true, 'htmlEntities'=>true));
    } else {
        return array(null, null, null);
    }
    $w = $thumbnail[$itemId]->getWidth();
    $h = $thumbnail[$itemId]->getHeight();

    if($w>$h){
        $r = $h/$w;
        $thumbWidth = (isset($_REQUEST['useMicro'])) ? $_REQUEST['useMicro'] : $w;
        $thumbHeight = (isset($_REQUEST['useMicro'])) ? floor($_REQUEST['useMicro'] * $r) : $h;
    }else{
        $r = $w/$h;
        $thumbWidth = (isset($_REQUEST['useMicro'])) ? $_REQUEST['useMicro']  * $r: $w;
        $thumbHeight = (isset($_REQUEST['useMicro'])) ? floor($_REQUEST['useMicro']) : $h;
    }
    return array($thumbUrl, $thumbWidth, $thumbHeight);
}

function getLink($item) {
    global $gallery;
    $id = (isset($_REQUEST['linkToParent']) && $_REQUEST['linkToParent'] == 1)?$item->getParentId():$item->getId();
    $urlGenerator = &$gallery->getUrlGenerator();
    return $urlGenerator->generateUrl(array('view'=>'core.ShowItem', 'itemId'=>$id), array('forceFullUrl'=>true, 'forceSessionId'=>false));
}

function getPreferredLink($item) {
    global $gallery;
    $urlGenerator = &$gallery->getUrlGenerator();
    return $urlGenerator->generateUrl(array('view'=>'core.ShowItem', 'itemId'=>$item->getId(), 'imageViewsIndex'=>0), array('forceFullUrl'=>true, 'forceSessionId'=>false));
}

function getView($item) {
    if (!method_exists($item, 'getId') || $item->getEntityType() == 'GalleryAlbumItem'){
        return null;
    }
    global $gallery;
    $urlGenerator = &$gallery->getUrlGenerator();
    if(preg_match('/video/', $item->getMimeType()) || preg_match('/audio/', $item->getMimeType())){
        return $urlGenerator->generateUrl(array('view'=>'multimedia.DownloadItem', 'itemId'=>$item->getId(), 'serialNumber'=>$item->getSerialNumber()), array('forceFullUrl'=>true, 'forceSessionId'=>true, 'htmlEntities'=>false));
    }else{
        return $urlGenerator->generateUrl(array('view'=>'core.DownloadItem', 'itemId'=>$item->getId(), 'serialNumber'=>$item->getSerialNumber()), array('forceFullUrl'=>true, 'forceSessionId'=>true, 'htmlEntities'=>true));
    }
}

function cdata($text) {
    return '<![CDATA['.$text.']]>';
}

function getBestImageId($masterId) {
    global $gallery;
	
	if (isset($_REQUEST['g2_maxImageHeight'])) {
        $maxImageHeight = $_REQUEST['g2_maxImageHeight'];
    }
    if (isset($_REQUEST['g2_maxImageWidth'])) {
        $maxImageWidth = $_REQUEST['g2_maxImageWidth'];
    }
    if (isset($_REQUEST['maxSize'])) {
        $maxImageWidth = $maxImageHeight = $_REQUEST['maxSize'];
    }
    $potentialImages = array();

    //how about the original?
    $ret = GalleryCoreApi::assertHasItemPermission($masterId, 'core.viewSource');
    if (!$ret) {
        //is there a preferred derivative of the original?
        list($ret, $preferred) = GalleryCoreApi::fetchPreferredsByItemIds(array($masterId));
        if ($ret) {
            die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
        }
        if (! empty($preferred[$masterId])) {
            $potentialImages[] = $preferred[$masterId];
        } else {
            //if no preferred, use the original original
            list($ret, $item) = GalleryCoreApi::loadEntitiesById($masterId);
            if ($ret) {
                die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
            }
            $potentialImages[] = $item;
        }
    }
    // If the user can see resized versions consider those too
    $ret = GalleryCoreApi::assertHasItemPermission($masterId, 'core.viewResizes');
    if (!$ret) {
        list($ret, $resizes) = GalleryCoreApi::fetchResizesByItemIds(array($masterId));
        if ($ret) {
            die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
        }
        if (! empty($resizes)) {
            foreach ($resizes[$masterId] as $resize) {
                $potentialImages[] = $resize;
            }
        }
    }
    //can always use the thumbnail
    list($ret, $thumbs) = GalleryCoreApi::fetchThumbnailsByItemIds(array($masterId));
    if ($ret) {
        die(GalleryCoreApi::error(ERROR_BAD_PARAMETER));
    }
    $potentialImages[] = $thumbs[$masterId];

    usort($potentialImages, 'byWidth');

    /* True if dimensions are taller/narrower than image, in which case width is the constraint. */
    $widthbound = ($potentialImages[0]->width > $potentialImages[0]->height) ? 1 : 0;


    /* Try closest match */
    if ($maxImageWidth && $widthbound) {
        $closest = '';
        $nearSize = $potentialImages[0]->width;
        foreach ($potentialImages as $potentialImage) {
            $difference = ($maxImageWidth - $potentialImage->width) * (($potentialImage->width > $maxImageWidth) ? - 1 : 1);
            if ($difference < $nearSize) {
                $nearSize = $difference;
                $closest = $potentialImage;
            }
        }
    } else if ($maxImageHeight) {
        $closest = '';
        $nearSize = $potentialImages[0]->height;
        foreach ($potentialImages as $potentialImage) {
            $difference = ($maxImageHeight - $potentialImage->height) * (($potentialImage->height > $maxImageHeight) ? - 1 : 1);
            if ($difference < $nearSize) {
                $nearSize = $difference;
                $closest = $potentialImage;
            }
        }
    }
    return array(null, $closest);
}

function byWidth($a, $b) {
    if ($a->width == $b->width)
        return 0;
    return ($a->width < $b->width) ? - 1 : 1;
}

function getBreadCrumbs($item){
    global $gallery;
    list($ret, $parents) = GalleryCoreApi::fetchParents($item);
    if($ret){
        die($ret->getAsHtml());
    }
    $urlGenerator = &$gallery->getUrlGenerator();
    $json = array();
    foreach($parents as $parent){
        $json[] = getJsonObject($parent);
    }
    $json[] = getJsonObject($item);
    return $json;
}

function getJsonp($item) {
    global $gallery, $userId;
    $json = array();

    $offset = isset($_REQUEST['offset'])?$_REQUEST['offset']:0;
    $max = isset($_REQUEST['max'])?$_REQUEST['max']:0;
    list($ret, $childIds) = GalleryCoreApi::fetchChildItemIds($item, $offset, $max, $userId);
    if ($ret) {
        $json['error'] = "Error finding child item ids: ".$ret->getAsHtml();
    }
    list($ret, $items) = GalleryCoreApi::loadEntitiesById($childIds, 'GalleryItem');
    if ($ret) {
        $json['error'] = "Error loading childItems: ".$ret->getAsHtml();
    }

    foreach ($items as $item) {
        $json[] = getJsonObject($item);
    }
    return $json;
}

function getJsonObject($item){
    if (!method_exists($item, 'getId')){
        return null;
    }
    $itemId = $item->getId();
    $thisUrl = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_NAME'] . '?g2_itemId=' . $itemId;
    $typeMap = array(
        'GalleryAlbumItem' => 'album',
        'GalleryPhotoItem' => 'photo',
        'GalleryMovieItem' => 'movie',
        'GalleryUnknownItem' => preg_match('/audio/', getMime($item))?'audio':'unknown' 
    );
    $childIds = null;
    if(method_exists($item, 'getOrderBy')){
        list($ret, $childIds) = GalleryCoreApi::fetchChildItemIds($item);
        if($ret){
            $tmp['error'] = "Error fetching childItemIds: ".$ret->getAsHtml();
        }
    }
    list($thumbUrl, $thumbWidth, $thumbHeight) = getThumbUrl($item);
    if (hasPermission($itemId)) {
        $tmp = array();
        $tmp['url'] = $thisUrl;
        $tmp['entity'] = array(
            'id' => $itemId,
            'title' => getTitle($item),
            'web_url' => getLink($item),
            'file_url_public' => getView($item),
            'mime_type' => getMime($item),
            'type' => $typeMap[$item->getEntityType()],
            'height' => getHeight($item),
            'width' => getWidth($item),
            'description' => $item->getDescription(),
            'thumb_url_public' => $thumbUrl,
            'thumb_height' => $thumbHeight,
            'thumb_width'=> $thumbWidth,
        );
        if ((isset($_REQUEST['maxSize']) && $_REQUEST['maxSize'] != 0) || 
            (isset($_REQUEST['g2_maxImageHeight']) && $_REQUEST['g2_maxImageHeight'] != 0 && 
                isset($_REQUEST['g2_maxImageWidth']) && $_REQUEST['g2_maxImageWidth'] != 0)) {
            list($ret, $resize) = getBestImageId($itemId);
            if ($ret) {
                $json['error'] = 'Error getting best-fit image: '.$ret->getAsHtml();
            }
            $tmp['entity']['resize_url_public'] = getView($resize);
            $tmp['entity']['resize_height'] = getHeight($resize);
            $tmp['entity']['resize_width'] = getWidth($resize);
        }
        $tmp['members'] = $childIds;

    }
    return $tmp;
}

init();
global $gallery,$userId,$g2_itemId,$item;
if (!$userId) {
    $userId = $gallery->getActiveUserId();
}
if (!$userId) {
    list($ret, $userId) = GalleryCoreApi::getAnonymousUserId();
}
if (isset($_REQUEST['mode'])) {
    $mode = $_REQUEST['mode'];
} else {
    $mode = '';
}
if (isset($_REQUEST['g2_itemId'])) {
    $g2_itemId = $_REQUEST['g2_itemId'];
    list($ret, $item) = GalleryCoreApi::loadEntitiesById($g2_itemId, 'GalleryItem');
    if ($ret) {
        die("Error loading initial item:".$ret->getAsHtml());
    }
}
if (isset($_REQUEST['g2_view'])) {
    $g2_view = $_REQUEST['g2_view'];
}
if (($item && $item->entityType == "GalleryAlbumItem") || isset($_REQUEST['mode'])) {
    switch ($mode) {
        case 'dynamic':
            switch ($g2_view) {
                case 'dynamicalbum.UpdatesAlbum':
                    die(sprintf('%s(%s)', $_GET['callback'], json_encode(getDynamicChildIds($userId))));
                    break;
                case 'dynamicalbum.PopularAlbum':
                    die(sprintf('%s(%s)', $_GET['callback'], json_encode(getDynamicChildIds($userId, 'views', 'viewCount', ORDER_DESCENDING, 'GalleryItemAttributesMap', 'itemId'))));
                    break;
                case 'dynamicalbum.RandomAlbum':
                    die(sprintf('%s(%s)', $_GET['callback'], json_encode(getDynamicChildIds($userId, 'random', 'random', ORDER_ASCENDING, null, 'id'))));
                    break;
                case 'keyalbum.KeywordAlbum':
                    die(sprintf('%s(%s)', $_GET['callback'], json_encode(getKeywordChildIds($userId, $g2_keyword = null))));
                    break;
                case 'tags.VirtualAlbum':
                    die(sprintf('%s(%s)', $_GET['callback'], json_encode(getTagChildIds($userId, $g2_tagName = null))));
                    break;
                default:
                    die(sprintf('%s(%s)', $_GET['callback'], json_encode(getDynamicChildIds($userId))));
            }
            break;
        case 'search':
            die(sprintf('%s(%s)', $_GET['callback'], json_encode(getSearchItems($g2_itemId))));
            break;
        case 'jsonp':
            die(sprintf('%s(%s)', $_GET['callback'], json_encode(getJsonObject($item))));
            break;
        case 'members':
            die(sprintf('%s(%s)', $_GET['callback'], json_encode(getJsonp($item))));
            break;
        case 'breadcrumbs':
            die(sprintf('%s(%s)', $_GET['callback'], json_encode(getBreadCrumbs($item))));
            break;
        default:
            die(sprintf('%s(%s)', $_GET['callback'], json_encode(getJsonObject($item))));
            break;
    }// end switch
}

?>
