<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
include 'simple_html_dom.php';
$IMAGE_URL = 'https://images.craigslist.org/IMAGE_ID_600x450.jpg';
$area = $_GET['area'];
$query = $_GET['query'];

$html = file_get_html('https://' . $area . '.craigslist.org/search/sss?sort=rel&query=' . $query);
$results = array();
foreach ($html->find('li[class=result-row]') as $row) {
    $pid = $row->getAttribute('data-pid');
    $tmp = $row->find('a[class=result-image]', 0);
    $url = $tmp->getAttribute('href');
    if (substr($url, 0, 2) != "//") {
        $url = $area . ".craigslist.org" . $url;
    }

    $urls = array("https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg");
    if ($tmp->getAttribute('data-ids')) {
        $cb1 = function ($a) {
            global $IMAGE_URL;
            return str_replace("IMAGE_ID", substr($a, strpos($a, "1:") + 2), $IMAGE_URL);
        };
        $urls = array_map($cb1, explode(",", $tmp->getAttribute('data-ids')));
    }

    $price = "$0";
    $tmp = $row->find('span[class=result-price]', 0);
    if ($tmp) {
        $price = $tmp->plaintext;
    }

    $date = $row->find('time[class=result-date]', 0)->plaintext;
    $title = html_entity_decode($row->find('a[class=result-title]', 0)->plaintext);
    $location = '(' . $area . ')';
    if ($row->find('span[class=result-hood]', 0)) {
        $location = trim($row->find('span[class=result-hood]', 0)->plaintext, ' ');
    } else if ($row->find('span[class=nearby]', 0)) {
        $location = html_entity_decode(trim($row->find('span[class=nearby]', 0)->plaintext));
    }

    $res = array(
        "id" => $pid,
        "url" => $url,
        "title" => $title,
        "date" => $date,
        "description" => '',
        "price" => $price,
        "location" => $location,
        "pics" => $urls
    );
    array_push($results, $res);
}
$results = array("area" => $area, "results" => $results);
echo json_encode($results);

