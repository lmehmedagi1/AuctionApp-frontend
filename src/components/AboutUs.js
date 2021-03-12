import React from 'react'

import BigImage from '../assets/images/about-us-big-image.jpg'
import SmallImage1 from '../assets/images/about-us-small-image-1.jpg'
import SmallImage2 from '../assets/images/about-us-small-image-2.jpg'

import Breadcrumb from '../common/Breadcrumbs'
import Menu from '../common/Menu'

function AboutUs() {
    return (
        <div>
            <Menu />
            <Breadcrumb />
            <div className="aboutUsContainer">
                <div id="aboutTitle">
                    About us
                </div>
                <div id="aboutUsGrid">
                    <div className="aboutUsGridItem">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis consequat pretium turpis, in eleifend mi laoreet sed. Donec ipsum mauris, venenatis sit amet porttitor id, laoreet eu magna. In convallis diam volutpat libero tincidunt semper. Ut aliquet erat rutrum, venenatis lacus ut, ornare lectus. Quisque congue ex sit amet diam malesuada, eget laoreet quam molestie. In id elementum turpis. Curabitur quis tincidunt mauris. Duis pharetra a odio vitae consectetur. Nullam vitae lacinia nisi, at porta sapien. Etiam vehicula augue at lacus tempus euismod. Nullam sit amet eros ut metus pulvinar volutpat et elementum lacus. Cras mauris mi, vulputate ac justo vitae, fringilla vestibulum sapien. Sed hendrerit nulla id luctus placerat. Sed venenatis ornare augue, et viverra dolor ullamcorper id. Duis id quam hendrerit, mollis ex ut, varius ipsum.
                        <br />
                        <br />
                        Etiam bibendum viverra nulla, at cursus leo fringilla eget. In pellentesque viverra elit id vestibulum. Sed eget leo suscipit, commodo urna vitae, efficitur ligula. Pellentesque non mauris blandit, ultrices nibh consectetur, auctor velit. Nunc ac justo lacus. Vivamus et gravida ante. Quisque cursus augue ligula, aliquam ullamcorper enim ultricies sit amet. In placerat sapien eu ligula commodo pharetra. Nunc et facilisis dolor, ut condimentum metus. Phasellus lacinia efficitur diam sed pharetra. Nullam euismod magna at mauris hendrerit scelerisque vitae vel leo. Cras interdum tellus in sapien fermentum consequat.
                    </div>
                    <div className="aboutUsGridItem">
                        <div>
                            <img src={BigImage} alt="Image" />
                        </div>
                        <div id="aboutUsSmallImage1">
                            <img src={SmallImage1} alt="Image" />
                        </div>
                        <div id="aboutUsSmallImage2">
                            <img src={SmallImage2} alt="Image" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUs;
