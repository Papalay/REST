<?php

namespace DSApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function indexAction()
    {
        return $this->render('DSApiBundle:Default:index.html.twig');
    }
}
