/*
 * U.S.Geological Survey Software User Rights Notice
 * 
 * Copied from http://water.usgs.gov/software/help/notice/ on September 7, 2012.  
 * Please check webpage for updates.
 * 
 * Software and related material (data and (or) documentation), contained in or
 * furnished in connection with a software distribution, are made available by the
 * U.S. Geological Survey (USGS) to be used in the public interest and in the 
 * advancement of science. You may, without any fee or cost, use, copy, modify,
 * or distribute this software, and any derivative works thereof, and its supporting
 * documentation, subject to the following restrictions and understandings.
 * 
 * If you distribute copies or modifications of the software and related material,
 * make sure the recipients receive a copy of this notice and receive or can get a
 * copy of the original distribution. If the software and (or) related material
 * are modified and distributed, it must be made clear that the recipients do not
 * have the original and they must be informed of the extent of the modifications.
 * 
 * For example, modified files must include a prominent notice stating the 
 * modifications made, the author of the modifications, and the date the 
 * modifications were made. This restriction is necessary to guard against problems
 * introduced in the software by others, reflecting negatively on the reputation of the USGS.
 * 
 * The software is public property and you therefore have the right to the source code, if desired.
 * 
 * You may charge fees for distribution, warranties, and services provided in connection
 * with the software or derivative works thereof. The name USGS can be used in any
 * advertising or publicity to endorse or promote any products or commercial entity
 * using this software if specific written permission is obtained from the USGS.
 * 
 * The user agrees to appropriately acknowledge the authors and the USGS in publications
 * that result from the use of this software or in products that include this
 * software in whole or in part.
 * 
 * Because the software and related material are free (other than nominal materials
 * and handling fees) and provided "as is," the authors, the USGS, and the 
 * United States Government have made no warranty, express or implied, as to accuracy
 * or completeness and are not obligated to provide the user with any support, consulting,
 * training or assistance of any kind with regard to the use, operation, and performance
 * of this software nor to provide the user with any updates, revisions, new versions or "bug fixes".
 * 
 * The user assumes all risk for any damages whatsoever resulting from loss of use, data,
 * or profits arising in connection with the access, use, quality, or performance of this software.
 */
package gov.usgs.cida.coastalhazards.wps;

import gov.usgs.cida.coastalhazards.util.FeatureCollectionFromShp;
import java.io.File;
import java.net.URL;
import org.geoserver.catalog.Catalog;
import org.geoserver.wps.gs.ImportProcess;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.junit.Ignore;
import org.junit.Test;

/**
 *
 * @author Jordan Walker <jiwalker@usgs.gov>
 */
public class CalculateIntersectionsProcessTest {
    
    private Catalog dummyCat = new DummyCatalog();
    
    /**
     * Test of execute method, of class CalculateIntersectionsProcess.
     */
    @Test
    @Ignore
    public void testExecute() throws Exception {
        URL transectShapefile = CreateTransectsAndIntersectionsProcessTest.class.getClassLoader()
                .getResource("gov/usgs/cida/coastalhazards/jersey/NewJerseyN_transects.shp");
        URL shorelineShapefile = CreateTransectsAndIntersectionsProcessTest.class.getClassLoader()
                .getResource("gov/usgs/cida/coastalhazards/jersey/NewJerseyN_shorelines.shp");
        SimpleFeatureCollection baselinefc = (SimpleFeatureCollection)
                FeatureCollectionFromShp.featureCollectionFromShp(transectShapefile);
        SimpleFeatureCollection shorelinefc = (SimpleFeatureCollection)
                FeatureCollectionFromShp.featureCollectionFromShp(shorelineShapefile);
        
        ImportProcess dummyImport = new DummyImportProcess();
        CalculateIntersectionsProcess process = new CalculateIntersectionsProcess(dummyImport, dummyCat);
        process.execute(shorelinefc, baselinefc, null, null, null, null);
    }
    
       /**
     * Test of execute method, of class CalculateIntersectionsProcess.
     */
    @Test
    @Ignore
    public void testExecuteAndOutputShp() throws Exception {
        File shpfile = File.createTempFile("test", ".shp");
        URL transectShapefile = CreateTransectsAndIntersectionsProcessTest.class.getClassLoader()
                .getResource("gov/usgs/cida/coastalhazards/jersey/NewJerseyN_transects.shp");
        URL shorelineShapefile = CreateTransectsAndIntersectionsProcessTest.class.getClassLoader()
                .getResource("gov/usgs/cida/coastalhazards/jersey/NewJerseyN_shorelines.shp");
        SimpleFeatureCollection baselinefc = (SimpleFeatureCollection)
                FeatureCollectionFromShp.featureCollectionFromShp(transectShapefile);
        SimpleFeatureCollection shorelinefc = (SimpleFeatureCollection)
                FeatureCollectionFromShp.featureCollectionFromShp(shorelineShapefile);
        
        ImportProcess dummyImport = new DummyImportProcess(shpfile);
        CalculateIntersectionsProcess process = new CalculateIntersectionsProcess(dummyImport, dummyCat);
        process.execute(shorelinefc, baselinefc, null, null, null, null);
    }
}
